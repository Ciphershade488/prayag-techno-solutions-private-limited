import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  Clock,
  Mail,
  Link as LinkIcon,
} from 'lucide-react';
import { api, Job } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AdminJobFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { company } = useCompany();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('IT Services');
  const [location, setLocation] = useState('Prayagraj, U.P.');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [experience, setExperience] = useState('1-3 years');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('');
  const [applicationEmail, setApplicationEmail] = useState('pts.info@mail.com');
  const [applicationLink, setApplicationLink] = useState('');
  const [status, setStatus] = useState<'active' | 'closed'>('active');
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      api
        .getAdminJobById(id)
        .then((job) => {
          setTitle(job.title || '');
          setDepartment(job.department || 'IT Services');
          setLocation(job.location || 'Prayagraj, U.P.');
          setEmploymentType(job.employment_type || 'Full-time');
          setExperience(job.experience || '1-3 years');
          setSalary(job.salary || '');
          setDescription(job.description || '');
          setResponsibilities(job.responsibilities || '');
          setRequirements(job.requirements || '');
          setSkills(job.skills || '');
          setApplicationEmail(job.application_email || company.email || 'pts.info@mail.com');
          setApplicationLink(job.application_link || '');
          setStatus(job.status || 'active');
          setCreatedAt(job.created_at || null);
        })
        .catch((err) => {
          setError(err?.message || 'Failed to load job details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode, company.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (!department.trim()) {
      setError('Department is required.');
      return;
    }
    if (!location.trim()) {
      setError('Job location is required.');
      return;
    }
    if (!description.trim()) {
      setError('Job description is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Job> = {
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        employment_type: employmentType.trim(),
        experience: experience.trim(),
        salary: salary.trim() || null,
        description: description.trim(),
        responsibilities: responsibilities.trim() || null,
        requirements: requirements.trim() || null,
        skills: skills.trim() || null,
        application_email: applicationEmail.trim() || null,
        application_link: applicationLink.trim() || null,
        status,
      };

      if (isEditMode && id) {
        await api.updateJob(id, payload);
        setSuccess('Job opening updated successfully!');
      } else {
        await api.createJob(payload);
        setSuccess('New job opening published successfully!');
      }

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 900);
    } catch (err: any) {
      setError(err?.message || 'Failed to save job opening.');
    } finally {
      setSubmitting(false);
    }
  };

  const departmentsList = [
    'IT Services',
    'HR & BPO',
    'GeM Services',
    'Operations & Administration',
    'Customer Support & Telecalling',
    'Software & Web Development',
    'Digital Marketing & Sales',
  ];

  const employmentTypesList = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {isEditMode ? 'Edit Job Opening' : 'Post New Job'} — {company.company_name}
        </title>
      </Helmet>

      <div className="max-w-4xl space-y-6">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Job Openings</span>
          </Link>
          {createdAt && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>Created on {new Date(createdAt).toLocaleDateString('en-IN')}</span>
            </span>
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {isEditMode ? 'Edit Job Opening' : 'Post a New Job Opening'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {isEditMode
              ? 'Update the details, role requirements, compensation, and publication status.'
              : 'Add a new career listing for candidates. Active listings appear on the public careers page.'}
          </p>
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
          {/* Card: Primary Job Details */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-white">
              1. Basic Job Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="job-title" className="text-xs font-medium text-slate-300">
                  Job Title <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="job-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior IT Support Engineer, GeM Consultant, BPO Executive"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-dept" className="text-xs font-medium text-slate-300">
                  Department / Service Vertical <span className="text-rose-400">*</span>
                </Label>
                <div className="flex gap-2">
                  <select
                    id="job-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary focus:outline-none"
                  >
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-location" className="text-xs font-medium text-slate-300">
                  Location <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="job-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Prayagraj, U.P. / Kochi / Remote"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-emp-type" className="text-xs font-medium text-slate-300">
                  Employment Type
                </Label>
                <select
                  id="job-emp-type"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary focus:outline-none"
                >
                  {employmentTypesList.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-exp" className="text-xs font-medium text-slate-300">
                  Experience Required
                </Label>
                <Input
                  id="job-exp"
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 0-2 years, 2-5 years, Fresher"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="job-salary" className="text-xs font-medium text-slate-300">
                  Salary / Compensation (Optional)
                </Label>
                <Input
                  id="job-salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹2,50,000 - ₹4,00,000 / year or Best in Industry"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card: Role Details & Requirements */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-white">
              2. Description & Requirements
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-desc" className="text-xs font-medium text-slate-300">
                  Role Overview / Description <span className="text-rose-400">*</span>
                </Label>
                <textarea
                  id="job-desc"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a clear, engaging overview of what this role entails..."
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-responsibilities" className="text-xs font-medium text-slate-300">
                  Key Responsibilities (One per line or bullet points)
                </Label>
                <textarea
                  id="job-responsibilities"
                  rows={4}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="• Manage hardware and network maintenance&#10;• Coordinate client support calls&#10;• Provide daily reporting to operations lead"
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-requirements" className="text-xs font-medium text-slate-300">
                  Requirements & Qualifications (One per line or bullet points)
                </Label>
                <textarea
                  id="job-requirements"
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="• Bachelor's degree in Computer Science or IT&#10;• 2+ years of relevant troubleshooting experience&#10;• Fluency in English and Hindi"
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-skills" className="text-xs font-medium text-slate-300">
                  Required Skills (Comma-separated)
                </Label>
                <Input
                  id="job-skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Hardware Diagnostics, Windows Server, Networking, AMC, Excel"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card: Application Method & Status */}
          <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-white">
              3. Application Channel & Publication Status
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="job-app-email" className="text-xs font-medium text-slate-300">
                  Application Email
                </Label>
                <Input
                  id="job-app-email"
                  type="email"
                  value={applicationEmail}
                  onChange={(e) => setApplicationEmail(e.target.value)}
                  placeholder="pts.info@mail.com"
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-app-link" className="text-xs font-medium text-slate-300">
                  External Application Link (Optional)
                </Label>
                <Input
                  id="job-app-link"
                  type="url"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="https://..."
                  className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-slate-300">
                  Listing Status <span className="text-rose-400">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-800">
                    <input
                      type="radio"
                      name="job-status"
                      value="active"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="accent-primary"
                    />
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Active (Publicly visible on Careers page)</span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-800">
                    <input
                      type="radio"
                      name="job-status"
                      value="closed"
                      checked={status === 'closed'}
                      onChange={() => setStatus('closed')}
                      className="accent-primary"
                    />
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span>Closed / Inactive (Hidden from public)</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/jobs"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Job...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Update Job Listing' : 'Publish Job Opening'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminJobFormPage;
