import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { api, CompanyDetails } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AdminCompanyPage: React.FC = () => {
  const { company, refreshCompany } = useCompany();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [shortName, setShortName] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhones, setSecondaryPhones] = useState<string[]>([]);
  const [newSecondaryPhone, setNewSecondaryPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState<Array<{ label: string; line: string }>>([]);
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .getAdminCompanyDetails()
      .then((data) => {
        setCompanyName(data.company_name || '');
        setLegalName(data.legal_name || '');
        setShortName(data.short_name || '');
        setTagline(data.tagline || '');
        setAbout(data.about || '');
        setPhone(data.phone || '');
        setSecondaryPhones(data.phones ? data.phones.filter((p) => p !== data.phone) : []);
        setEmail(data.email || '');
        setAddress(data.address || '');
        setAddresses(data.addresses || []);
        setWebsite(data.website || '');
        setFacebook(data.facebook || '');
        setHours(data.hours || '');
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load company information.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddPhone = () => {
    if (newSecondaryPhone.trim()) {
      setSecondaryPhones([...secondaryPhones, newSecondaryPhone.trim()]);
      setNewSecondaryPhone('');
    }
  };

  const handleRemovePhone = (index: number) => {
    setSecondaryPhones(secondaryPhones.filter((_, i) => i !== index));
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { label: 'Branch Office', line: '' }]);
  };

  const handleAddressChange = (index: number, field: 'label' | 'line', value: string) => {
    const next = [...addresses];
    next[index][field] = value;
    setAddresses(next);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Primary phone number is required.');
      return;
    }

    setSaving(true);
    try {
      const allPhones = [phone.trim(), ...secondaryPhones.filter(Boolean)];
      const validAddresses = addresses.filter((a) => a.line.trim().length > 0);

      const payload: Partial<CompanyDetails> = {
        company_name: companyName.trim(),
        legal_name: legalName.trim() || companyName.trim(),
        short_name: shortName.trim() || 'Prayag Techno',
        tagline: tagline.trim(),
        about: about.trim(),
        phone: phone.trim(),
        phones: allPhones,
        email: email.trim(),
        address: address.trim(),
        addresses: validAddresses.length > 0 ? validAddresses : [{ label: 'Corporate Office', line: address.trim() }],
        website: website.trim(),
        facebook: facebook.trim(),
        hours: hours.trim(),
      };

      await api.updateCompanyDetails(payload);
      await refreshCompany();
      setSuccess('Company information saved successfully! All website pages are now updated.');
    } catch (err: any) {
      setError(err?.message || 'Failed to save company information.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm">Loading company settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Company Details Management — {company.company_name}</title>
      </Helmet>

      <div className="max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Company Details
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage corporate name, contact phone numbers, emails, addresses, and about text.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card: Brand & Identity */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
              <Building2 className="h-4 w-4 text-primary" />
              <span>1. Corporate Identity</span>
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="company-name" className="text-xs font-medium text-slate-300">
                  Display Brand Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="PRAYAG TECHNO SOLUTIONS"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="legal-name" className="text-xs font-medium text-slate-300">
                  Registered Legal Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="legal-name"
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="short-name" className="text-xs font-medium text-slate-300">
                  Short / Compact Name
                </Label>
                <Input
                  id="short-name"
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Prayag Techno"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="tagline" className="text-xs font-medium text-slate-300">
                  Company Tagline / Subtitle
                </Label>
                <Input
                  id="tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="IT Services, HR Services & BPO Solutions"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="about" className="text-xs font-medium text-slate-300">
                  About Company / Profile Summary
                </Label>
                <textarea
                  id="about"
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Describe your company vision, expertise, and service mission..."
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card: Contact Channels */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
              <Phone className="h-4 w-4 text-primary" />
              <span>2. Contact Details & Social Channels</span>
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="primary-phone" className="text-xs font-medium text-slate-300">
                  Primary Phone / WhatsApp <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="primary-phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-9336737908"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primary-email" className="text-xs font-medium text-slate-300">
                  Official Email Address <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="primary-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pts.info@mail.com"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              {/* Secondary Phones */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-medium text-slate-300">
                  Additional Phone Numbers
                </Label>
                <div className="space-y-2">
                  {secondaryPhones.map((p, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={p}
                        onChange={(e) => {
                          const next = [...secondaryPhones];
                          next[index] = e.target.value;
                          setSecondaryPhones(next);
                        }}
                        className="border-slate-800 bg-slate-900 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-rose-400"
                        title="Remove phone number"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add another phone (e.g. +91-8800646846)"
                      value={newSecondaryPhone}
                      onChange={(e) => setNewSecondaryPhone(e.target.value)}
                      className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhone}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website-url" className="text-xs font-medium text-slate-300">
                  Website URL
                </Label>
                <Input
                  id="website-url"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://prayagtechno.com"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="facebook-url" className="text-xs font-medium text-slate-300">
                  Facebook Page URL
                </Label>
                <Input
                  id="facebook-url"
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://www.facebook.com/prayagtechnosolutions"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="business-hours" className="text-xs font-medium text-slate-300">
                  Business Hours
                </Label>
                <Input
                  id="business-hours"
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Monday – Saturday, 09:30 – 18:30 IST"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card: Office Addresses */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                <MapPin className="h-4 w-4 text-primary" />
                <span>3. Physical Locations & Addresses</span>
              </h2>
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Another Office</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="primary-address" className="text-xs font-medium text-slate-300">
                  Corporate / Registered Office Address <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="primary-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="53C/12D, M.L.N. Road, Prayagraj (Allahabad), U.P. – 211002"
                  className="border-slate-800 bg-slate-900 text-white focus-visible:border-primary"
                />
              </div>

              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:flex-row sm:items-center"
                >
                  <div className="w-full sm:w-44">
                    <Input
                      type="text"
                      placeholder="Label (e.g. Branch Office)"
                      value={addr.label}
                      onChange={(e) => handleAddressChange(index, 'label', e.target.value)}
                      className="border-slate-800 bg-slate-900 text-xs text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Office Address line"
                      value={addr.line}
                      onChange={(e) => handleAddressChange(index, 'line', e.target.value)}
                      className="border-slate-800 bg-slate-900 text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="self-end rounded-md p-2 text-slate-400 hover:text-rose-400 sm:self-center"
                    title="Remove address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Company Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminCompanyPage;
