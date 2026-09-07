import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CalendarCheck, CheckCircle2, Loader2, Mail, Phone, Clock } from 'lucide-react';
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
      setError('Please select a service.');
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
      setError(err?.message || 'Unable to send your booking request right now. Please try again or call us directly.');
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Online — {company.company_name}</title>
        <meta
          name="description"
          content={`Schedule a consultation with ${company.legal_name} for GeM consultancy, IT services, HR, BPO, or web development.`}
        />
      </Helmet>

      <section className="border-b border-border bg-muted/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Consultation</span>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Book a Consultation
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Pick a date, time, and service. We'll confirm your session within
              one business day and connect via Google Meet, Microsoft Teams, or
              phone.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <Reveal>
            {status === 'success' ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-foreground">Request received</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you, {form.name.split(' ')[0]}. Your request for{' '}
                  <strong className="text-foreground">{form.service}</strong> on{' '}
                  <strong className="text-foreground">{form.preferred_date}</strong> at{' '}
                  <strong className="text-foreground">{form.preferred_time}</strong> has
                  been sent. We will confirm your appointment by email within one
                  business day.
                </p>
                <button
                  onClick={() => {
                    setForm(initialForm);
                    setStatus('idle');
                  }}
                  className="mt-7 h-11 rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="bk-name">Full name *</Label>
                    <Input
                      id="bk-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bk-email">Email *</Label>
                    <Input
                      id="bk-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="jane@company.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bk-phone">Phone number *</Label>
                    <Input
                      id="bk-phone"
                      type="tel"
                      required
                      maxLength={40}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 ..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Service *</Label>
                    <Select required value={form.service} onValueChange={(v) => set('service', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
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
                    <Label htmlFor="bk-date">Preferred date *</Label>
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
                    <Label>Preferred time (IST) *</Label>
                    <Select required value={form.preferred_time} onValueChange={(v) => set('preferred_time', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
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
                    <Label htmlFor="bk-msg">How can we help? (optional)</Label>
                    <Textarea
                      id="bk-msg"
                      rows={4}
                      maxLength={2000}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Briefly describe your project or the issue you'd like to discuss."
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-lg bg-secondary/70 p-4">
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
                    I consent to {company.legal_name} processing the personal data I have
                    provided for the purpose of handling my booking request.
                  </Label>
                </div>

                {error && (
                  <p className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="h-4 w-4" /> Request booking
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="space-y-6">
              <div className="rounded-2xl bg-[hsl(222,47%,11%)] p-7 text-white">
                <h2 className="font-display text-lg font-semibold">What happens next?</h2>
                <ol className="mt-5 space-y-4 text-sm text-slate-300">
                  {[
                    'You send the request — no payment, no obligation.',
                    'We review availability and confirm by email within one business day.',
                    'We meet online or on-site and discuss your goals for 30–45 minutes.',
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-card p-7">
                <h2 className="font-display text-lg font-semibold text-foreground">Prefer to reach us directly?</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${company.email}`} className="hover:text-foreground">
                      {company.email}
                    </a>
                  </li>
                  {company.phones?.map((p) => (
                    <li key={p} className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${p.replace(/[^+\d]/g, '')}`} className="hover:text-foreground">
                        {p}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-primary" /> {company.hours}
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
