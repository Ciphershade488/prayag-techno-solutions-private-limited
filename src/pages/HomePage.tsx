import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ArrowRight, Facebook, ShieldCheck, Server, Users, LineChart,
  Compass, CheckCircle2, Award, Clock, Globe, Phone, Mail, MapPin,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import { SITE } from '@/lib/site';

const HERO_IMG = 'https://images.hostinger.com/c19a37f2-e9fb-4082-8645-1989a3f63ca2.png';
const ABOUT_IMG = 'https://images.hostinger.com/cbe32938-4c5c-45e8-b402-3645304e21e2.png';

const SERVICE_CARDS = [
  {
    icon: Compass,
    title: 'GeM Services',
    text: 'Expert guidance on the Government e-Marketplace — new registration, product & comparative listing, tender analysis, bidding, legal compliance and sales growth analysis.',
    points: ['New Registration', 'Product Listing', 'Tender & Bidding', 'Legal Compliance', 'Market Analysis', 'Sales Growth Analysis'],
  },
  {
    icon: Server,
    title: 'IT Services',
    text: 'Understand your need — laptop, desktop & server support, printer solutions, AMC, remote & onsite support, data recovery and IT product sales and purchase.',
    points: ['Laptop / Desktop / Servers', 'AMC & Tech Support', 'Remote & Onsite Support', 'Data Recovery', 'Web Solutions', 'IT Consultancy'],
  },
  {
    icon: Users,
    title: 'HR & BPO Service',
    text: 'Grow your business with human resource services, employee management, BPO services, data entry & processing, translation work and back-office support.',
    points: ['Human Resource Services', 'Employee Management', 'BPO Services', 'Data Entry & Processing', 'Translation Work', 'Back Office Work'],
  },
];

const STATS = [
  { icon: Award, value: 2017, suffix: '', label: 'Serving clients since', isYear: true },
  { icon: CheckCircle2, value: 500, suffix: '+', label: 'Projects delivered' },
  { icon: Users, value: 50, suffix: '+', label: 'Professionals on board' },
  { icon: Globe, value: 3, suffix: '', label: 'Office locations in India' },
];

const BOARD = [
  { name: 'Pankaj Kumar Mishra', role: 'Managing Director' },
  { name: 'Aneesh Chetan Dwivedi', role: 'CEO / Founder' },
  { name: 'Mamta Mishra', role: 'HR Head' },
];

const LEADERS = [
  { name: 'Govind Kumar Pandey', role: 'Business Consultant' },
  { name: 'Puneet Srivastava', role: 'C.O.O.' },
  { name: 'Chetna Pal', role: 'Human Resource (HR)' },
  { name: 'Raveena C Xavier', role: 'BDM' },
];

const WHY = [
  'Experienced professionals serving startups to large firms since 2017',
  'Tailored solutions delivered on time with measurable growth',
  'Three offices across India — Prayagraj and Kochi',
  'A single accountable point of contact for every engagement',
];

const HomePage = () => (
  <>
    <Helmet>
      <title>PRAYAG TECHNO SOLUTIONS — IT Services, HR Services & BPO Solutions</title>
      <meta
        name="description"
        content="PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED delivers GeM consultancy, IT services, HR & BPO solutions, web development and tech support. Serving clients across India since 2017. Book a consultation online."
      />
    </Helmet>

    {/* Hero */}
    <section className="relative overflow-hidden bg-[hsl(222,47%,9%)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(60rem 30rem at 80% -10%, hsl(214 90% 40% / 0.45), transparent 60%)' }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Trusted technology partner since 2017
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            IT Services, HR Services &{' '}
            <span className="text-blue-400">BPO Solutions</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            We're {SITE.legalName}, and we can't wait to start working together.
            Your vision is important to us — we map out the needs of your business
            and provide the necessary tools to achieve a successful future.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/book-online"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-900/40 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Book a consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-300"
            >
              <Facebook className="h-4 w-4" /> Find us on Facebook
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl border border-white/10" />
            <img
              src={HERO_IMG}
              alt="PRAYAG TECHNO SOLUTIONS team delivering IT, HR and BPO solutions"
              className="relative aspect-[16/11] w-full rounded-2xl object-cover shadow-2xl"
              loading="eager"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-[hsl(222,47%,12%)]/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
              <p className="font-display text-2xl font-bold text-blue-400">Since 2017</p>
              <p className="text-xs text-slate-300">delivering tailored solutions on time</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Stats band */}
    <section className="border-b border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">
                {s.isYear ? s.value : <CountUp value={s.value} suffix={s.suffix} />}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Services */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Services</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Strategic services for every size of client
        </h2>
        <p className="mt-4 text-muted-foreground">
          Backed by a team of experienced professionals, our services meet the
          needs of all types and sizes of clients — from small startups to large
          firms — and deliver lasting changes with measurable growth.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {SERVICE_CARDS.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-blue-900/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Get in Touch <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* About */}
    <section className="bg-secondary/50">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <img
            src={ABOUT_IMG}
            alt="PRAYAG TECHNO SOLUTIONS consultants reviewing client systems"
            className="aspect-[3/2] w-full rounded-2xl object-cover shadow-xl"
            loading="lazy"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Who we are</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A partner, not just a provider
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Since 2017, clients have turned to {SITE.legalName} as a professional
            IT consulting company &amp; HR solutions provider that's ready to
            deliver tailored solutions on time. We combine our insights and skills
            to transform your processes and strategies — and in turn, your company.
          </p>
          <ul className="mt-6 space-y-3">
            {WHY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/book-online"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            Talk to our team <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>

    {/* Team */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Behind the Scenes</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Board of Members
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {BOARD.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-7 w-7" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Leaders</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          The team that drives us
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEADERS.map((m, i) => (
          <Reveal key={m.name} delay={(i % 4) * 0.06}>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-sm font-semibold text-foreground">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Contact */}
    <section className="bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact Us</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get in touch with our offices
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITE.addresses.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-sm font-semibold text-foreground">{a.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-sm text-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> {SITE.email}
              </a>
              {SITE.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2.5 text-sm text-foreground transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> {p}
                </a>
              ))}
            </div>
            <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" /> {SITE.hours}
            </span>
          </div>
        </Reveal>
      </div>
    </section>

    {/* CTA */}
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(222,47%,11%)] px-6 py-14 text-center text-white sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: 'radial-gradient(40rem 20rem at 50% 120%, hsl(214 90% 45% / 0.5), transparent 65%)' }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to map out your business needs?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Book a no-obligation consultation online — choose a service, date and
              time that suits you, and we will confirm within one business day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/book-online"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Book Online <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-12 items-center rounded-md border border-white/20 px-7 text-sm font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-300"
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
