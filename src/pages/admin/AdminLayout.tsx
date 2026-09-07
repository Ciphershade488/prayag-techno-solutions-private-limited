import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  CalendarCheck,
  Users,
  LogOut,
  ExternalLink,
  CircuitBoard,
  Menu,
  X,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/jobs', label: 'Job Openings', icon: Briefcase },
    { to: '/admin/company', label: 'Company Details', icon: Building2 },
    { to: '/admin/bookings', label: 'Client Bookings', icon: CalendarCheck },
    { to: '/admin/applications', label: 'Job Applications', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 p-5 lg:flex">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <CircuitBoard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold tracking-tight text-white">
              {company.shortName || 'Prayag Techno'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Bottom Controls */}
        <div className="border-t border-slate-800 pt-4">
          <div className="mb-3 rounded-lg bg-slate-900/90 p-3 text-xs">
            <div className="text-slate-400">Signed in as</div>
            <div className="truncate font-semibold text-white">{user?.username || user?.email}</div>
            <div className="mt-0.5 truncate text-[11px] text-slate-400">{user?.email}</div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Public Site</span>
              </span>
              <span className="text-[10px] text-slate-400">↗</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6 lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CircuitBoard className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold text-white">Admin Control</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-800 bg-slate-950 p-4 lg:hidden">
            <div className="mb-3 rounded-lg bg-slate-900 p-3 text-xs">
              <span className="text-slate-400">Signed in as: </span>
              <span className="font-semibold text-white">{user?.username || user?.email}</span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Public Site</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
