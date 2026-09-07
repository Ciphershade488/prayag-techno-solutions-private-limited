import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { api, Job } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const AdminJobsPage: React.FC = () => {
  const { company } = useCompany();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Delete modal state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      const data = await api.getAdminJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job.id);
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      const updated = await api.toggleJobStatus(job.id, newStatus);
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteJob(jobToDelete.id);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      setJobToDelete(null);
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const departments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills && job.skills.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : job.status === statusFilter;

    const matchesDept =
      departmentFilter === 'all' ? true : job.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

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

  return (
    <>
      <Helmet>
        <title>Manage Jobs & Careers — {company.company_name}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Job Openings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage, publish, edit, and archive career listings for {company.company_name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <span>Public Careers</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/admin/jobs/add"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Job</span>
            </Link>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by job title, department, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-800 bg-slate-900 pl-9 text-sm text-white placeholder:text-slate-500 focus-visible:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                All ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  statusFilter === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Active ({jobs.filter((j) => j.status === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('closed')}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  statusFilter === 'closed'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Closed ({jobs.filter((j) => j.status === 'closed').length})
              </button>
            </div>

            {/* Department Dropdown */}
            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                aria-label="Filter by department"
                className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 focus:border-primary focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Jobs List / Table */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm">Loading jobs database...</p>
            </div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-semibold">Job Title & Experience</th>
                    <th className="px-4 py-3.5 font-semibold">Department</th>
                    <th className="px-4 py-3.5 font-semibold">Location</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold">Date Added</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-slate-900/40">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">{job.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                          <span>{job.employment_type}</span>
                          <span>•</span>
                          <span>Exp: {job.experience}</span>
                          {job.salary && (
                            <>
                              <span>•</span>
                              <span className="text-slate-300">{job.salary}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-300">
                        <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                          {job.department}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          <span>{job.location}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job)}
                          disabled={togglingId === job.id}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                            job.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          )}
                          title="Click to toggle status (Active / Closed)"
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

                      <td className="px-4 py-4 text-xs text-slate-400">
                        {formatDate(job.created_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/jobs/edit/${job.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 px-2.5 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-900/40 hover:text-rose-200"
                            title="Delete job opening"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
            <h3 className="mt-3 font-display text-base font-bold text-white">No jobs matched</h3>
            <p className="mt-1 text-xs text-slate-400">
              {searchQuery || statusFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try clearing or modifying your search filters.'
                : 'No job openings exist in the system yet.'}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              {(searchQuery || statusFilter !== 'all' || departmentFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDepartmentFilter('all');
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Reset Filters
                </button>
              )}
              <Link
                to="/admin/jobs/add"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Job</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Delete Job Opening</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{jobToDelete.title}"</strong> ({jobToDelete.department})?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Yes, Delete Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminJobsPage;
