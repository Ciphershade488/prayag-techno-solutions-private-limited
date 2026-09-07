import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

function formatCompany(row: any) {
  if (!row) return null;
  let phones: string[] = [];
  let addresses: any[] = [];
  try {
    phones = JSON.parse(row.phones_json || '[]');
  } catch {
    phones = row.phone ? [row.phone] : [];
  }
  try {
    addresses = JSON.parse(row.addresses_json || '[]');
  } catch {
    addresses = row.address ? [{ label: 'Main Office', line: row.address }] : [];
  }

  return {
    id: row.id,
    company_name: row.company_name,
    legal_name: row.legal_name,
    short_name: row.short_name || 'Prayag Techno',
    tagline: row.tagline,
    about: row.about,
    phone: row.phone,
    phones: Array.isArray(phones) && phones.length > 0 ? phones : [row.phone],
    email: row.email,
    address: row.address,
    addresses: Array.isArray(addresses) && addresses.length > 0 ? addresses : [{ label: 'Main Office', line: row.address }],
    website: row.website,
    facebook: row.facebook,
    hours: row.hours,
    updated_at: row.updated_at,
  };
}

// PUBLIC: GET /api/company
router.get('/company', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM company_details LIMIT 1');
    const row = result.rows[0];
    if (!row) {
      res.status(404).json({ error: 'Company details not configured yet.' });
      return;
    }
    res.json(formatCompany(row));
  } catch (error: any) {
    console.error('Fetch company details error:', error);
    res.status(500).json({ error: 'Failed to retrieve company details.' });
  }
});

// ADMIN: GET /api/admin/company
router.get('/admin/company', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM company_details LIMIT 1');
    const row = result.rows[0];
    if (!row) {
      res.status(404).json({ error: 'Company details not configured.' });
      return;
    }
    res.json(formatCompany(row));
  } catch (error: any) {
    console.error('Admin fetch company details error:', error);
    res.status(500).json({ error: 'Failed to retrieve company details.' });
  }
});

// ADMIN: PUT /api/admin/company
router.put('/admin/company', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const {
      company_name,
      legal_name,
      short_name,
      tagline,
      about,
      phone,
      phones,
      email,
      address,
      addresses,
      website,
      facebook,
      hours,
    } = req.body;

    if (!company_name || !company_name.trim()) {
      res.status(400).json({ error: 'Company name is required.' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ error: 'Email address is required.' });
      return;
    }
    if (!phone || !phone.trim()) {
      res.status(400).json({ error: 'Phone number is required.' });
      return;
    }

    const currentRes = await query('SELECT id FROM company_details LIMIT 1');
    const companyId = currentRes.rows[0]?.id || 'company-main';
    const now = new Date().toISOString();

    const phonesJson = Array.isArray(phones) ? JSON.stringify(phones) : JSON.stringify([phone.trim()]);
    const addressesJson = Array.isArray(addresses)
      ? JSON.stringify(addresses)
      : JSON.stringify([{ label: 'Main Office', line: address?.trim() || '' }]);

    const updateRes = await query(`
      UPDATE company_details SET
        company_name = $1,
        legal_name = $2,
        short_name = $3,
        tagline = $4,
        about = $5,
        phone = $6,
        phones_json = $7,
        email = $8,
        address = $9,
        addresses_json = $10,
        website = $11,
        facebook = $12,
        hours = $13,
        updated_at = $14
      WHERE id = $15
      RETURNING *
    `, [
      company_name.trim(),
      (legal_name || company_name).trim(),
      (short_name || 'Prayag Techno').trim(),
      (tagline || '').trim(),
      (about || '').trim(),
      phone.trim(),
      phonesJson,
      email.trim().toLowerCase(),
      (address || '').trim(),
      addressesJson,
      (website || '').trim(),
      (facebook || '').trim(),
      (hours || 'Monday – Saturday, 09:30 – 18:30 IST').trim(),
      now,
      companyId
    ]);

    const updatedRow = updateRes.rows[0];
    res.json(formatCompany(updatedRow));
  } catch (error: any) {
    console.error('Update company details error:', error);
    res.status(500).json({ error: 'Failed to update company details.' });
  }
});

export default router;
