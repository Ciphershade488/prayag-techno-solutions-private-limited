import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, AlertCircle, CircuitBoard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthed, loading: authLoading } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('admin@prayagtechno.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');

  const redirectPath = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthed && !authLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthed, authLoading, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter both your username/email and password.');
      return;
    }

    setStatus('submitting');
    try {
      await login(identifier.trim(), password);
      setStatus('idle');
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Invalid username/email or password.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — {company.company_name}</title>
        <meta name="description" content="Secure administrative login for Prayag Techno Solutions." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="flex min-h-screen items-center justify-center bg-[hsl(222,47%,9%)] px-4 py-12 text-white">
        <div className="w-full max-w-md">
          {/* Top Logo / Return Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Website</span>
            </Link>
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure Admin Access</span>
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[hsl(222,40%,12%)] p-8 shadow-2xl backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <CircuitBoard className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight text-white">
                  Admin Sign In
                </h1>
                <p className="text-xs text-slate-400">
                  {company.company_name || 'PRAYAG TECHNO SOLUTIONS'}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Sign in to manage job openings, career applications, consultation bookings, and company details.
            </p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-identifier" className="text-xs font-medium text-slate-300">
                  Username or Email Address
                </Label>
                <Input
                  id="admin-identifier"
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@prayagtechno.com or admin"
                  className="border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-medium text-slate-300">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-center text-[11px] text-slate-400">
              Session is encrypted & protected with secure server-side JWT authentication.
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLoginPage;
