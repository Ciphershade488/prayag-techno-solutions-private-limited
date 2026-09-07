import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Building2,
  ExternalLink,
  CalendarCheck,
  Users,
  Loader2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api, AdminStats, Job } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const { company } = useCompany();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job.id);
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      await api.toggleJobStatus(job.id, newStatus);
      await fetchStats();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — {company.company_name}</title>
      </Helmet>

      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Overview of job vacancies, career applications, and company settings for {company.company_name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/jobs/add"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Job</span>
            </Link>

            <Link
              to="/admin/company"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <Building2 className="h-4 w-4" />
              <span>Company Info</span>
            </Link>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Job Openings
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Briefcase className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">
                {stats?.totalJobs ?? 0}
              </span>
              <span className="text-xs text-slate-400">listings in system</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Link to="/admin/jobs" className="text-blue-400 hover:underline">
                View all jobs →
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Active Job Openings
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-emerald-400">
                {stats?.activeJobs ?? 0}
              </span>
              <span className="text-xs text-slate-400">live on public careers page</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Visible to job applicants online
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Closed / Inactive Jobs
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <XCircle className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-300">
                {stats?.closedJobs ?? 0}
              </span>
              <span className="text-xs text-slate-400">hidden from public</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Can be reactivated at any time
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Career Applications
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">
                {stats?.totalApplications ?? 0}
              </span>
              <span className="text-xs text-slate-400">received candidates</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              <Link to="/admin/applications" className="text-purple-400 hover:underline">
                Review applications →
              </Link>
            </div>
          </div>
        </div>

        {/* Recently Added Jobs Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg font-bold text-white">Recently Added Jobs</h2>
              <p className="text-xs text-slate-400">
                Quickly toggle availability or edit job specifications.
              </p>
            </div>
            <Link
              to="/admin/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
            >
              <span>Manage all {stats?.totalJobs ?? 0} jobs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats?.recentJobs && stats.recentJobs.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pr-4 font-semibold">Job Title & Role</th>
                    <th className="pb-3 pr-4 font-semibold">Department</th>
                    <th className="pb-3 pr-4 font-semibold">Location</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 pr-4 font-semibold">Posted Date</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentJobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-slate-900/50">
                      <td className="py-3.5 pr-4 font-medium text-white">
                        <div>{job.title}</div>
                        <div className="text-xs text-slate-400">{job.employment_type} • {job.experience}</div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300">{job.department}</td>
                      <td className="py-3.5 pr-4 text-slate-300">{job.location}</td>
                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          disabled={togglingId === job.id}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                            job.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          )}
                          title="Click to toggle status"
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              job.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'
                            )}
                          />
                          <span className="capitalize">{job.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-400">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/jobs/edit/${job.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-slate-800 py-10 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-2 text-sm text-slate-400">No job openings created yet.</p>
              <Link
                to="/admin/jobs/add"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create First Job Opening</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links & Information */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Live Website Integration
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Changes made in this dashboard automatically update the public website. When you add or activate a job opening, it instantly displays on the public careers page with full requirements and application options.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
              >
                <span>View Public Careers</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/book-online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
              >
                <span>View Consultation Booking</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Company Information Status
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Company legal name, corporate and branch addresses, business hours, and contact phones are configured and dynamically synced.
            </p>
            <div className="mt-3 text-xs text-slate-400">
              <span className="font-medium text-white">{company.legal_name}</span>
              <br />
              Primary Contact: {company.phone} • {company.email}
            </div>
            <div className="mt-4">
              <Link
                to="/admin/company"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                <span>Edit Company Information</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
