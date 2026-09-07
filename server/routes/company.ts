import { Router, Request, Response } from 'express';
import { db } from '../db';
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
router.get('/company', (_req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM company_details LIMIT 1').get();
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
router.get('/admin/company', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM company_details LIMIT 1').get();
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
router.put('/admin/company', requireAdminAuth, (req: Request, res: Response) => {
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

    const row = db.prepare('SELECT id FROM company_details LIMIT 1').get() as { id: string } | undefined;
    const now = new Date().toISOString();

    const phonesList = Array.isArray(phones) && phones.length > 0 ? phones : [phone.trim()];
    const addressesList = Array.isArray(addresses) && addresses.length > 0 ? addresses : [{ label: 'Main Office', line: address.trim() }];

    if (row) {
      db.prepare(`
        UPDATE company_details SET
          company_name = ?,
          legal_name = ?,
          short_name = ?,
          tagline = ?,
          about = ?,
          phone = ?,
          phones_json = ?,
          email = ?,
          address = ?,
          addresses_json = ?,
          website = ?,
          facebook = ?,
          hours = ?,
          updated_at = ?
        WHERE id = ?
      `).run(
        company_name.trim(),
        legal_name ? legal_name.trim() : company_name.trim(),
        short_name ? short_name.trim() : 'Prayag Techno',
        tagline ? tagline.trim() : '',
        about ? about.trim() : '',
        phone.trim(),
        JSON.stringify(phonesList),
        email.trim(),
        address ? address.trim() : '',
        JSON.stringify(addressesList),
        website ? website.trim() : '',
        facebook ? facebook.trim() : '',
        hours ? hours.trim() : '',
        now,
        row.id
      );
    } else {
      const id = 'company-main';
      db.prepare(`
        INSERT INTO company_details (
          id, company_name, legal_name, short_name, tagline, about,
          phone, phones_json, email, address, addresses_json, website, facebook, hours, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        company_name.trim(),
        legal_name ? legal_name.trim() : company_name.trim(),
        short_name ? short_name.trim() : 'Prayag Techno',
        tagline ? tagline.trim() : '',
        about ? about.trim() : '',
        phone.trim(),
        JSON.stringify(phonesList),
        email.trim(),
        address ? address.trim() : '',
        JSON.stringify(addressesList),
        website ? website.trim() : '',
        facebook ? facebook.trim() : '',
        hours ? hours.trim() : '',
        now
      );
    }

    const updatedRow = db.prepare('SELECT * FROM company_details LIMIT 1').get();
    res.json(formatCompany(updatedRow));
  } catch (error: any) {
    console.error('Update company details error:', error);
    res.status(500).json({ error: 'Failed to update company details.' });
  }
});

export default router;
