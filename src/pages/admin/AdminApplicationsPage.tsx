import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Mail, Phone, MapPin, Briefcase, ExternalLink, Loader2, Search } from 'lucide-react';
import { api, JobApplication } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';

export const AdminApplicationsPage: React.FC = () => {
  const { company } = useCompany();
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getAdminApplications()
      .then((data) => setApps(data))
      .catch((err) => console.error('Failed to load job applications:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = apps.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.full_name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.location && a.location.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Helmet>
        <title>Career Applications — {company.company_name}</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Career Applications
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Candidate resumes and applications submitted through the careers portal.
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="text"
            placeholder="Search by candidate name, role, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-slate-800 bg-slate-950 pl-9 text-sm text-white placeholder:text-slate-500"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm">Loading applications...</p>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm transition-colors hover:border-slate-700"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-base font-bold text-white">
                        {app.full_name}
                      </h3>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {app.role}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {app.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {app.phone}
                      </span>
                      {app.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {app.location}
                          </span>
                        </>
                      )}
                      {app.experience_years && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {app.experience_years} yrs exp
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {app.portfolio_url && (
                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      <span>Portfolio / Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {app.cover_letter && (
                  <div className="mt-4 rounded-lg bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-300">
                    <span className="font-semibold text-slate-400">Cover Note: </span>
                    {app.cover_letter}
                  </div>
                )}

                {app.resume_text && (
                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Summary / Resume Info: </span>
                    <p className="mt-1 whitespace-pre-wrap">{app.resume_text}</p>
                  </div>
                )}

                <div className="mt-4 text-right text-[11px] text-slate-400">
                  Applied on {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center text-slate-400">
            <Users className="mx-auto h-10 w-10 text-slate-600" />
            <h3 className="mt-3 font-display text-base font-bold text-white">No applications yet</h3>
            <p className="mt-1 text-xs text-slate-400">
              When candidates apply via the public careers page, their submissions will be recorded here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminApplicationsPage;
