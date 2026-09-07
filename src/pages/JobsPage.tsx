import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Send,
  Search,
  IndianRupee,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
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
import { api, Job } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { JOB_ROLES } from '@/lib/site';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  job_id: '',
  experience_years: '1-3',
  location: '',
  portfolio_url: '',
  message: '',
  gdpr: false,
};

const CULTURE_PILLARS = [
  {
    icon: TrendingUp,
    title: 'Merit-Driven Growth',
    desc: 'Structured career progression based on real impact, technical skill, and client success.',
  },
  {
    icon: Award,
    title: 'Hands-On Tech Experience',
    desc: 'Work on live government tender systems, high-density networks, and enterprise IT hardware.',
  },
  {
    icon: Users,
    title: 'Collaborative Environment',
    desc: 'Direct mentorship from executive leadership and seasoned domain consultants.',
  },
  {
    icon: ShieldCheck,
    title: 'Stability & Transparency',
    desc: 'Consistent payroll, formal service agreements, and standard corporate benefits.',
  },
];

export const JobsPage: React.FC = () => {
  const { company } = useCompany();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const records = await api.getPublicJobs();
        if (active) setJobs(records);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        if (active) setLoadingJobs(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const applyFor = (job: Job) => {
    setForm((f) => ({
      ...f,
      role: job.title,
      job_id: job.id,
      location: job.location,
    }));
    const el = document.getElementById('apply-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.role) {
      setError('Please select a position.');
      return;
    }
    if (!form.gdpr) {
      setError('Please consent to our data processing statement to proceed.');
      return;
    }

    setStatus('sending');
    try {
      await api.submitJobApplication({
        job_id: form.job_id || null,
        role: form.role,
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        experience_years: form.experience_years,
        location: form.location.trim(),
        portfolio_url: form.portfolio_url.trim(),
        cover_letter: form.message.trim(),
      });
      setStatus('success');
    } catch (err: any) {
      console.error('Job application failed', err);
      setError(err?.message || 'Unable to send your application right now. Please try again or email us directly.');
      setStatus('error');
    }
  };

  const departments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = filterDept === 'all' ? true : job.department === filterDept;
    const q = search.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      job.department.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (job.skills && job.skills.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  const roleOptions = Array.from(new Set([...jobs.map((j) => j.title), ...JOB_ROLES]));

  return (
    <>
      <Helmet>
        <title>Careers &amp; Current Job Openings — {company.company_name}</title>
        <meta
          name="description"
          content={`Explore current job openings at ${company.legal_name || company.company_name} in IT support, HR, BPO, and GeM consulting.`}
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[hsl(222,47%,9%)] py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(65rem 30rem at 75% -10%, hsl(214 90% 42% / 0.45), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Briefcase className="h-3.5 w-3.5" /> Careers &amp; Opportunities
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Build your career with {company.short_name || 'Prayag Techno'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {company.legal_name} is an expanding team of technology engineers, GeM advisors, and operations professionals delivering trusted business solutions across India.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why Join Us Culture Grid */}
      <section className="border-b border-border bg-slate-50/70 py-12 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CULTURE_PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h4 className="mt-4 font-display text-sm font-bold text-foreground">{p.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main Jobs Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Active Career Openings
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {filteredJobs.length} position{filteredJobs.length === 1 ? '' : 's'} currently open for application
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, skill, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 text-xs"
              />
            </div>

            {departments.length > 0 && (
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                aria-label="Filter by department"
                className="h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Listings */}
        {loadingJobs ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Search className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">No openings found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || filterDept !== 'all'
                ? 'Try adjusting your search query or department filter.'
                : 'There are no active listings at this moment. You may submit a spontaneous application below.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredJobs.map((job, i) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <Reveal key={job.id} delay={i * 0.05}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {job.department}
                          </span>
                          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                            {job.employment_type}
                          </span>
                        </div>

                        <h3 className="mt-3 flex items-center gap-2.5 font-display text-xl font-bold text-foreground">
                          <Briefcase className="h-5 w-5 text-primary" strokeWidth={1.8} />
                          <span>{job.title}</span>
                        </h3>

                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {job.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary" /> {job.experience} Experience
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                              <IndianRupee className="h-3.5 w-3.5" /> {job.salary}
                            </span>
                          )}
                        </div>

                        {job.skills && (
                          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                            {job.skills.split(',').map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
                        <button
                          type="button"
                          onClick={() => applyFor(job)}
                          className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 active:scale-[0.98]"
                        >
                          Apply Now
                        </button>

                        {(job.responsibilities || job.requirements || job.application_link) && (
                          <button
                            type="button"
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <span>{isExpanded ? 'Less details' : 'Job Specifications'}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Job Specifications */}
                    {isExpanded && (
                      <div className="border-t border-border bg-slate-50/60 p-6 dark:bg-slate-900/30 sm:p-7">
                        <div className="grid gap-6 md:grid-cols-2">
                          {job.responsibilities && (
                            <div>
                              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                                Responsibilities:
                              </h4>
                              <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                {job.responsibilities}
                              </p>
                            </div>
                          )}

                          {job.requirements && (
                            <div>
                              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                                Qualifications &amp; Skills:
                              </h4>
                              <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                {job.requirements}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                          <span>
                            Direct HR Desk:{' '}
                            <strong className="text-foreground">
                              {job.application_email || company.email}
                            </strong>
                          </span>
                          {job.application_link && (
                            <a
                              href={job.application_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <span>Official Application Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Application Form */}
        <div id="apply-form" className="mt-16 scroll-mt-24">
          <Reveal>
            {status === 'success' ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-md">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
                  Application Logged Successfully
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you for applying for the{' '}
                  <strong className="text-foreground">{form.role}</strong> opening at {company.legal_name}.
                  Our HR recruitment team will review your credentials and contact you if shortlisted.
                </p>
                <button
                  onClick={() => {
                    setForm(initialForm);
                    setStatus('idle');
                  }}
                  className="mt-7 h-11 rounded-md border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                      Candidate Application Form
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct candidate intake portal for Prayag Techno Solutions. All applications are routed to our HR desk.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="jb-name">Full Name *</Label>
                    <Input
                      id="jb-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="e.g. Amit Verma"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jb-email">Email Address *</Label>
                    <Input
                      id="jb-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="amit@example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jb-phone">Mobile Phone Number *</Label>
                    <Input
                      id="jb-phone"
                      type="tel"
                      required
                      maxLength={40}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 93367 37908"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Applying for Position *</Label>
                    <Select required value={form.role} onValueChange={(v) => set('role', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jb-exp">Relevant Experience (Years)</Label>
                    <Input
                      id="jb-exp"
                      type="text"
                      value={form.experience_years}
                      onChange={(e) => set('experience_years', e.target.value)}
                      placeholder="e.g. 2 years, Fresher, 5+ years"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jb-city">Current Location / City</Label>
                    <Input
                      id="jb-city"
                      type="text"
                      value={form.location}
                      onChange={(e) => set('location', e.target.value)}
                      placeholder="e.g. Prayagraj, Kochi, Lucknow"
                    />
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="jb-portfolio">Portfolio / LinkedIn / CV Drive Link (Optional)</Label>
                    <Input
                      id="jb-portfolio"
                      type="url"
                      value={form.portfolio_url}
                      onChange={(e) => set('portfolio_url', e.target.value)}
                      placeholder="https://linkedin.com/in/... or Google Drive resume link"
                    />
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="jb-msg">Cover Note / Experience Summary *</Label>
                    <Textarea
                      id="jb-msg"
                      required
                      rows={4}
                      maxLength={2000}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Briefly summarize your core qualifications, previous work achievements, and motivation for joining our firm."
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-lg border border-border/80 bg-slate-50/60 p-4 dark:bg-slate-900/40">
                  <Checkbox
                    id="jb-gdpr"
                    checked={form.gdpr}
                    onCheckedChange={(v) => set('gdpr', v === true)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="jb-gdpr"
                    className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
                  >
                    I consent to {company.legal_name || company.company_name} storing and processing my personal credentials for current and future employment evaluation.
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
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default JobsPage;
