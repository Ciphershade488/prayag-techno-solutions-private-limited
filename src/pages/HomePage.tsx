import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ArrowRight, Facebook, ShieldCheck, Server, Users, LineChart,
  Compass, CheckCircle2, Award, Clock, Globe, Phone, Mail, MapPin,
  Building2, Cpu, FileCheck2, Headphones, Layers, Sparkles, ChevronRight
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import { SITE } from '@/lib/site';

const HERO_IMG = 'https://images.hostinger.com/c19a37f2-e9fb-4082-8645-1989a3f63ca2.png';
const ABOUT_IMG = 'https://images.hostinger.com/cbe32938-4c5c-45e8-b402-3645304e21e2.png';

const SERVICE_CARDS = [
  {
    icon: Compass,
    tag: 'Government Procurement',
    title: 'GeM Services',
    text: 'Complete advisory on the Government e-Marketplace — vendor registration, catalogue listing, tender analysis, competitive bidding, legal compliance and sales growth roadmap.',
    points: [
      'Vendor & OEM Portal Registration',
      'Product & Service Catalogue Listing',
      'Tender & Bid Evaluation Analysis',
      'GeM Compliance & Incident Support',
      'Comparative Market Pricing',
      'Government Sales Growth Roadmap',
    ],
  },
  {
    icon: Server,
    tag: 'Infrastructure & Tech',
    title: 'IT Services & AMC Support',
    text: 'End-to-end enterprise IT operations — workstation, laptop and server support, hardware AMC, network setup, remote & onsite troubleshooting, and disaster recovery.',
    points: [
      'Laptop, Desktop & Server Support',
      'Annual Maintenance Contracts (AMC)',
      'Remote & Onsite Rapid Troubleshooting',
      'Enterprise Data Backup & Recovery',
      'LAN/WAN & Router Configuration',
      'IT Procurement & Tech Advisory',
    ],
  },
  {
    icon: Users,
    tag: 'Workforce & Operations',
    title: 'HR & BPO Solutions',
    text: 'Scalable human resource management, talent acquisition, attendance & payroll management, high-volume data entry, document digitization, and back-office operations.',
    points: [
      'Talent Sourcing & Staffing',
      'Payroll & Statutory Compliance',
      'Back-Office BPO Operations',
      'High-Speed Data Processing',
      'Document Digitization & Indexing',
      'Translation & Verification Work',
    ],
  },
];

const STATS = [
  { icon: Award, value: 2017, suffix: '', label: 'Serving clients since', isYear: true },
  { icon: CheckCircle2, value: 500, suffix: '+', label: 'Projects delivered' },
  { icon: Users, value: 50, suffix: '+', label: 'Professionals on board' },
  { icon: Globe, value: 3, suffix: '', label: 'Offices across India' },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Needs Assessment',
    desc: 'We analyze your current infrastructure, compliance standing, or workforce gaps to map exact operational requirements.',
  },
  {
    num: '02',
    title: 'Strategic Blueprint',
    desc: 'Our team crafts a tailored service SLA, procurement strategy, or deployment roadmap designed for measurable efficiency.',
  },
  {
    num: '03',
    title: 'Precision Execution',
    desc: 'Certified IT engineers, GeM specialists, and HR managers deploy solutions with minimal disruption to your daily operations.',
  },
  {
    num: '04',
    title: 'Continuous Review',
    desc: 'We provide ongoing monitoring, preventative AMC maintenance, and dedicated account management for long-term reliability.',
  },
];

const INDUSTRIES = [
  { name: 'Government & PSUs', desc: 'Compliant vendor procurement, tender analysis, and GeM catalogue deployment.' },
  { name: 'Corporate & IT', desc: 'Hardware lifecycle management, server uptime, remote helpdesk, and talent sourcing.' },
  { name: 'Manufacturing & Plants', desc: 'Factory workstation maintenance, network infrastructure, and high-volume data processing.' },
  { name: 'Healthcare & Institutions', desc: 'Secure data management, hardware AMCs, and regulatory document processing.' },
  { name: 'BFSI & Professional Services', desc: 'Back-office operations, KYC verification workflows, and mission-critical IT support.' },
  { name: 'SMEs & Growing Startups', desc: 'Flexible IT setup, HR payroll systems, and affordable tech infrastructure advisory.' },
];

const BOARD = [
  { name: 'Pankaj Kumar Mishra', role: 'Managing Director', initials: 'PK' },
  { name: 'Aneesh Chetan Dwivedi', role: 'CEO / Founder', initials: 'AD' },
  { name: 'Mamta Mishra', role: 'HR Head', initials: 'MM' },
];

const LEADERS = [
  { name: 'Govind Kumar Pandey', role: 'Business Consultant', initials: 'GP' },
  { name: 'Puneet Srivastava', role: 'Chief Operating Officer (C.O.O.)', initials: 'PS' },
  { name: 'Chetna Pal', role: 'Human Resource (HR)', initials: 'CP' },
  { name: 'Raveena C Xavier', role: 'Business Development Manager (BDM)', initials: 'RX' },
];

const WHY = [
  {
    title: 'Demonstrated Track Record',
    desc: 'Operating consistently since 2017 with hundreds of successful corporate and public sector engagements.',
  },
  {
    title: 'Stringent SLAs & Guarantees',
    desc: 'Fast response times, proactive system health audits, and accountable service delivery across all verticals.',
  },
  {
    title: 'Multi-Location Service Delivery',
    desc: 'Offices in Prayagraj and Kochi ensuring physical reach, on-site support, and pan-India administrative coordination.',
  },
  {
    title: 'Single Accountable Partner',
    desc: 'Consolidate your hardware support, government bidding, and workforce management with one trusted team.',
  },
];

const HomePage: React.FC = () => (
  <>
    <Helmet>
      <title>PRAYAG TECHNO SOLUTIONS — IT Services, HR Services & BPO Solutions</title>
      <meta
        name="description"
        content="PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED delivers GeM consultancy, IT services, HR & BPO solutions, web development and tech support. Serving clients across India since 2017. Book a consultation online."
      />
    </Helmet>

    {/* Hero Section */}
    <section className="relative overflow-hidden bg-[hsl(222,47%,9%)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(65rem 32rem at 75% -10%, hsl(214 90% 42% / 0.45), transparent 60%)' }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Enterprise Technology Partner Since 2017
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            IT Services, HR Services &amp;{' '}
            <span className="text-blue-400">BPO Solutions</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            We are {SITE.legalName}. We empower modern organizations with robust IT infrastructure, certified GeM advisory, and agile HR &amp; back-office operations tailored to drive lasting growth.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/book-online"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-900/40 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-300"
            >
              <Facebook className="h-4 w-4" /> Find Us on Facebook
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Registered Private Limited Company</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span>Offices in Prayagraj &amp; Kochi</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl border border-white/10" />
            <img
              src={HERO_IMG}
              alt="PRAYAG TECHNO SOLUTIONS team delivering IT, HR and BPO solutions"
              className="relative aspect-[16/11] w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
              loading="eager"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-[hsl(222,47%,12%)]/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
              <p className="font-display text-2xl font-bold text-blue-400">Established 2017</p>
              <p className="text-xs text-slate-300">Delivering enterprise reliability across India</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Metrics / Stats Band */}
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <s.icon className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {s.isYear ? s.value : <CountUp value={s.value} suffix={s.suffix} />}
              </p>
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Core Services Section */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <Reveal className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Layers className="h-3.5 w-3.5" /> Enterprise Capabilities
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Comprehensive business solutions designed for sustainable growth
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Backed by seasoned technology specialists and operational consultants, our practice areas serve institutions, growing enterprises, and established firms with dedicated SLAs.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {SERVICE_CARDS.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-7 transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-blue-900/5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1 text-[11px] font-semibold text-primary dark:border-blue-900/40 dark:bg-blue-950/40">
                    {s.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>

                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Key Capabilities</p>
                  <ul className="mt-3 space-y-2 text-xs text-foreground/90">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-4">
                <Link
                  to="/book-online"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:translate-x-1"
                >
                  Consult Our Team <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Proven Process / How We Work */}
    <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Cpu className="h-3.5 w-3.5" /> Operational Process
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A structured approach to ensure flawless execution
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            From initial requirement audits to ongoing SLA management, we follow a transparent 4-stage operational model for every engagement.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, idx) => (
            <Reveal key={step.num} delay={idx * 0.08}>
              <div className="relative h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40">
                <div className="font-display text-3xl font-extrabold text-blue-600/30 dark:text-blue-400/20">
                  {step.num}
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Company Background & Why Choose Us */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img
              src={ABOUT_IMG}
              alt="PRAYAG TECHNO SOLUTIONS consultants reviewing client systems"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl ring-1 ring-border"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 z-10 hidden rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:block">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Corporate Credibility</span>
              </div>
              <p className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">99.8% SLA Delivery</p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">Across all hardware &amp; IT contracts</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Building2 className="h-3.5 w-3.5" /> Why Prayag Techno Solutions
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A long-term strategic partner, not just a service vendor
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Since 2017, {SITE.legalName} has served as the trusted IT infrastructure, GeM procurement, and workforce engine for leading regional enterprises and public sector suppliers.
          </p>

          <div className="mt-8 space-y-4">
            {WHY.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 rounded-lg border border-border/80 bg-card p-4 transition-colors hover:border-primary/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/book-online"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Schedule an Executive Briefing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center gap-1.5 rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-primary"
            >
              Read Corporate Profile
            </Link>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Sectors We Empower */}
    <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Globe className="h-3.5 w-3.5" /> Industry Expertise
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sectors empowered by our integrated services
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We adapt our technology solutions and manpower operations to meet the regulatory, security, and throughput needs of varied industries.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.name} delay={i * 0.06}>
              <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                <div className="h-2 w-8 rounded bg-primary" />
                <h3 className="mt-4 font-display text-base font-bold text-foreground">{ind.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{ind.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Leadership & Board */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <Reveal className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Users className="h-3.5 w-3.5" /> Corporate Governance
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Board of Members &amp; Executive Leadership
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Guided by industry veterans committed to operational transparency, engineering standards, and sustainable enterprise relationships.
        </p>
      </Reveal>

      {/* Board */}
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {BOARD.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/40">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                {m.initials}
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">{m.name}</h3>
              <p className="mt-1 text-xs font-semibold text-primary">{m.role}</p>
              <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                Board Member • Prayag Techno Solutions
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Leaders */}
      <div className="mt-12">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Operational Leadership</h3>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERS.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 0.06}>
              <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:border-primary/40">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-display text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {m.initials}
                </span>
                <h4 className="mt-3 font-display text-sm font-bold text-foreground">{m.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Contact & Multi-Branch Offices */}
    <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <MapPin className="h-3.5 w-3.5" /> Nationwide Presence
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our offices &amp; service delivery centers
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Connect directly with our regional offices for on-site visits, emergency AMC calls, or corporate briefings.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.addresses.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">{a.label}</h3>
                      <span className="text-[11px] font-medium text-primary">Official Office</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.line}</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <a
                    href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Call This Location <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-xs font-semibold text-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> {SITE.email}
              </a>
              {SITE.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> {p}
                </a>
              ))}
            </div>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" /> {SITE.hours}
            </span>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Primary CTA Section */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(222,47%,11%)] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(40rem 20rem at 50% 120%, hsl(214 90% 45% / 0.55), transparent 65%)' }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              Start Your Engagement
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to elevate your technology and workforce operations?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Book a no-obligation strategic consultation online. Choose a service, date and time that suits you, and our solutions architects will connect within one business day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/book-online"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-900/30 transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Schedule Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-12 items-center rounded-md border border-white/20 bg-white/5 px-7 text-sm font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-300"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  </>
);

export default HomePage;
