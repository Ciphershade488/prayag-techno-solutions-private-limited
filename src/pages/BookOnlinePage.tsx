import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  FileCheck2,
  Headphones,
  Sparkles,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { SERVICES, TIME_SLOTS } from '@/lib/site';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  preferred_date: '',
  preferred_time: '',
  message: '',
  gdpr: false,
};

export const BookOnlinePage: React.FC = () => {
  const { company } = useCompany();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.service) {
      setError('Please select a service vertical.');
      return;
    }
    if (!form.preferred_date) {
      setError('Please choose your preferred consultation date.');
      return;
    }
    if (!form.preferred_time) {
      setError('Please select a preferred time slot.');
      return;
    }
    if (!form.gdpr) {
      setError('Please consent to our data processing statement to proceed.');
      return;
    }

    setStatus('sending');
    try {
      await api.submitBooking({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        message: form.message.trim(),
      });
      setStatus('success');
    } catch (err: any) {
      console.error('Booking failed', err);
      setError(err?.message || 'Unable to submit your booking request. Please try again or call us directly.');
      setStatus('error');
    }
  };

  const guarantees = [
    {
      icon: ShieldCheck,
      title: 'Free 30-Min Initial Assessment',
      desc: 'No-obligation discovery call to evaluate your IT setup, GeM bidding readiness, or staffing needs.',
    },
    {
      icon: FileCheck2,
      title: 'Direct Subject-Matter Advisors',
      desc: 'You will speak directly with experienced IT engineers or certified GeM analysts.',
    },
    {
      icon: Headphones,
      title: 'Prompt 24-Hour Confirmation',
      desc: 'Our administrative desk verifies scheduling and sends digital meeting links within 1 business day.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Book Online — {company.company_name}</title>
        <meta
          name="description"
          content={`Schedule a consultation with ${company.legal_name} for GeM consultancy, IT services, HR, BPO, or web development.`}
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[hsl(222,47%,9%)] py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(60rem 30rem at 80% -10%, hsl(214 90% 40% / 0.45), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <CalendarCheck className="h-3.5 w-3.5" /> Corporate Consultation
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Schedule an Executive Consultation
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Pick a service vertical, preferred date, and time. Our enterprise advisory team in Prayagraj will review your requirements and connect via Google Meet, Microsoft Teams, or in-person.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Form & Assurances Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Assurances Pill Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {guarantees.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <g.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{g.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <Reveal>
            {status === 'success' ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-md">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Consultation Request Confirmed</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you, <strong className="text-foreground">{form.name}</strong>. Your appointment request for{' '}
                  <strong className="text-foreground">{form.service}</strong> on{' '}
                  <strong className="text-foreground">{form.preferred_date}</strong> at{' '}
                  <strong className="text-foreground">{form.preferred_time}</strong> has been logged in our system.
                  Our team will email you a calendar invitation and session details within one business day.
                </p>
                <button
                  onClick={() => {
                    setForm(initialForm);
                    setStatus('idle');
                  }}
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="border-b border-border pb-4">
                  <h2 className="font-display text-xl font-bold text-foreground">Consultation Details</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please provide your contact information and briefing topic so we assign the right consultant.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="bk-name">Full Name *</Label>
                    <Input
                      id="bk-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bk-email">Corporate Email *</Label>
                    <Input
                      id="bk-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="e.g. rajesh@company.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bk-phone">Contact Phone *</Label>
                    <Input
                      id="bk-phone"
                      type="tel"
                      required
                      maxLength={40}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Service Vertical *</Label>
                    <Select required value={form.service} onValueChange={(v) => set('service', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service vertical" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bk-date">Preferred Date *</Label>
                    <Input
                      id="bk-date"
                      type="date"
                      required
                      min={today}
                      value={form.preferred_date}
                      onChange={(e) => set('preferred_date', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Preferred Time (IST) *</Label>
                    <Select required value={form.preferred_time} onValueChange={(v) => set('preferred_time', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time window" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="bk-msg">Brief Agenda / Requirements (Optional)</Label>
                    <Textarea
                      id="bk-msg"
                      rows={4}
                      maxLength={2000}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Outline any specific hardware issues, tender numbers, headcount targets, or questions you wish to cover."
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Checkbox
                    id="bk-gdpr"
                    checked={form.gdpr}
                    onCheckedChange={(v) => set('gdpr', v === true)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="bk-gdpr"
                    className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
                  >
                    I consent to {company.legal_name || company.company_name} securely processing the data submitted above to coordinate my consultation in accordance with standard business privacy guidelines.
                  </Label>
                </div>

                {error && (
                  <p className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">{error}</p>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request…
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-4 w-4" /> Confirm Consultation Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Reveal>

          {/* Right Sidebar Information */}
          <Reveal delay={0.1}>
            <aside className="space-y-6">
              <div className="rounded-2xl bg-[hsl(222,47%,11%)] p-7 text-white shadow-md">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Procedure</span>
                <h3 className="mt-1 font-display text-lg font-bold">What happens next?</h3>
                <ol className="mt-5 space-y-4 text-xs leading-relaxed text-slate-300">
                  {[
                    'You submit the request — no fee, no binding commitment.',
                    'Our coordinator reviews consultant availability within one business day.',
                    'We send an email confirmation with calendar link or dispatch engineer details.',
                    'A 30–45 minute strategic session focused on solving your exact challenge.',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
                <h3 className="font-display text-base font-bold text-foreground">Immediate Assistance</h3>
                <p className="mt-1 text-xs text-muted-foreground">Prefer to speak directly with our desk?</p>
                <ul className="mt-5 space-y-3.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${company.email}`} className="font-medium hover:text-primary">
                      {company.email}
                    </a>
                  </li>
                  {company.phones?.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${p.replace(/[^+\d]/g, '')}`} className="font-medium hover:text-primary">
                        {p}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{company.hours}</span>
                  </li>
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default BookOnlinePage;
