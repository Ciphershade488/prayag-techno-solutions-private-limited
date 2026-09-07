import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  Cpu,
  FileCheck2,
  Headphones,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useCompany } from '@/contexts/CompanyContext';

export const AboutPage: React.FC = () => {
  const { company } = useCompany();

  const milestones = [
    {
      year: '2017',
      title: 'Company Incorporation',
      desc: 'Founded in Prayagraj with a dedicated mandate to provide reliable corporate IT hardware support, network engineering, and Annual Maintenance Contracts (AMC).',
      badge: 'Inception',
    },
    {
      year: '2019',
      title: 'HR & BPO Expansion',
      desc: 'Established dedicated workforce outsourcing, executive recruitment, data digitization, and multilingual translation desks for regional enterprise clients.',
      badge: 'Diversification',
    },
    {
      year: '2021',
      title: 'GeM Advisory Practice',
      desc: 'Pioneered full-cycle Government e-Marketplace advisory — helping manufacturers and sellers navigate registrations, tender bidding, and compliance.',
      badge: 'Procurement',
    },
    {
      year: '2023–Present',
      title: 'Multi-Region Footprint',
      desc: 'Expanded operational footprint with our Fort Kochi, Kerala business center, serving clients nationwide with distributed support capabilities.',
      badge: 'Expansion',
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Integrity & Rigorous SLAs',
      desc: 'Transparent pricing, predictable turnaround times, and contractually binding service level agreements across every engagement.',
    },
    {
      icon: Users,
      title: 'Client-Centric Alignment',
      desc: 'We map out the exact operational bottlenecks of your enterprise and engineer custom technical and human resources solutions.',
    },
    {
      icon: Award,
      title: 'Engineering Standards',
      desc: 'Continuous certification and technical training ensure our hardware specialists and consultants deliver industry-leading quality.',
    },
    {
      icon: CheckCircle2,
      title: 'Verifiable Delivery',
      desc: 'More than 500 projects, hundreds of hardware AMCs, and tens of thousands of document batches successfully executed since 2017.',
    },
  ];

  const capabilities = [
    {
      icon: Cpu,
      title: 'Diagnostic & Hardware Lab',
      desc: 'Equipped with precision testing benches in Prayagraj for component-level laptop, workstation, server, and printer diagnostics and rapid recovery.',
    },
    {
      icon: Layers,
      title: 'BPO & Digitization Floor',
      desc: 'High-throughput document scanning, optical verification, data indexing, and English-Hindi transcription pipelines handling thousands of daily records.',
    },
    {
      icon: FileCheck2,
      title: 'GeM Procurement Cell',
      desc: 'Specialized bid evaluators and tender strategists actively monitoring government portals, reverse auctions, and catalog approvals.',
    },
    {
      icon: Headphones,
      title: 'Central Helpdesk & AMC Desk',
      desc: 'Single-point-of-contact support system guaranteeing rapid remote troubleshooting and prioritized onsite technician dispatch.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us — {company.legal_name || company.company_name}</title>
        <meta
          name="description"
          content={`Learn about ${company.legal_name || company.company_name}, providing enterprise IT Services, HR Outsourcing, BPO Solutions, and GeM Consultancy across India since 2017.`}
        />
        <meta property="og:title" content={`About Us — ${company.company_name}`} />
        <meta
          property="og:description"
          content={`Corporate background, mission, leadership, and service network of ${company.legal_name || company.company_name}.`}
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[hsl(222,47%,9%)] py-20 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(65rem 30rem at 75% -10%, hsl(214 90% 42% / 0.45), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
                <Building2 className="h-3.5 w-3.5" /> Corporate Profile &amp; Governance
              </span>
              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                About {company.company_name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                {company.legal_name || 'PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED'} is an established Indian technology, human capital, and business process management enterprise incorporated in 2017, headquartered in Prayagraj with service nodes across the country.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Corporate Overview & Facts */}
      <section className="border-b border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Who We Are
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Strategic capability built on reliability, precision, and trust
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {company.about ||
                    "We're PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED, and we can't wait to start working together. Your vision is important to us — we map out the needs of your business and provide the necessary tools to achieve a successful future."}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Whether our clients require mission-critical Annual Maintenance Contracts (AMC) for servers and desktops, turnkey Government e-Marketplace (GeM) tender compliance, or high-volume workforce staffing and data digitisation, we provide consistent, accountable execution.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/book-online"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    <span>Schedule Executive Meeting</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <span>Explore Careers</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-border bg-slate-50/80 p-6 shadow-sm dark:bg-slate-900/60 sm:p-8">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Company Profile &amp; Facts
                    </h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      Verified
                    </span>
                  </div>

                  <dl className="mt-5 space-y-3.5 text-xs">
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">Legal Entity</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {company.legal_name || 'PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED'}
                      </dd>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">Founded In</dt>
                      <dd className="font-semibold text-foreground">2017</dd>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">Head Office</dt>
                      <dd className="font-semibold text-foreground">Prayagraj (Allahabad), U.P.</dd>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">Branch Office</dt>
                      <dd className="font-semibold text-foreground">Mumfordganj, Prayagraj</dd>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">South India Center</dt>
                      <dd className="font-semibold text-foreground">Fort Kochi, Ernakulam, Kerala</dd>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">Service Delivery</dt>
                      <dd className="font-semibold text-foreground">Pan-India Support</dd>
                    </div>
                    <div className="flex justify-between pt-1">
                      <dt className="font-medium text-muted-foreground">Business Hours</dt>
                      <dd className="font-semibold text-foreground">
                        {company.hours || 'Monday – Saturday, 09:30 – 18:30 IST'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Infrastructure / Capabilities */}
      <section className="border-b border-border bg-slate-50/60 py-16 sm:py-24 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Infrastructure
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Operational pillars and specialized service centers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Our facilities combine modern diagnostic hardware with dedicated workforce floor space to execute projects at scale.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <c.icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Values
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Guiding principles that define our client engagements
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Every project is anchored in standard corporate governance, transparent SLAs, and technological rigor.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chronological Milestones Timeline */}
      <section className="border-t border-border bg-slate-50/70 py-16 sm:py-24 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Company Milestones
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our journey of continuous enterprise delivery
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.08}>
                <div className="relative h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-extrabold text-primary">
                      {m.year}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary dark:bg-blue-950/50">
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Location Presence */}
      <section className="border-t border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Nationwide Presence
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Corporate offices and regional centers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Direct physical accessibility for technical support, client reviews, hardware handovers, and candidate interviews.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {company.addresses && company.addresses.length > 0 ? (
              company.addresses.map((addr, idx) => (
                <Reveal key={idx} delay={idx * 0.08}>
                  <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MapPin className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <div>
                          <h3 className="font-display text-sm font-bold text-foreground">
                            {addr.label}
                          </h3>
                          <span className="text-[11px] font-medium text-primary">Registered Node</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                        {addr.line}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-border pt-4">
                      <a
                        href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Contact Location <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-sm font-bold text-foreground">Headquarters</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{company.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-primary py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Partner With Us
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
              Ready to collaborate with Prayag Techno Solutions?
            </h2>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-blue-100 sm:text-sm">
              Schedule an onsite briefing in Prayagraj or Kochi, or book a digital consultation with our executive team.
            </p>
          </div>
          <Link
            to="/book-online"
            className="shrink-0 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-slate-100 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
