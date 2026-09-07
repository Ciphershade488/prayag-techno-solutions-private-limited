import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Facebook, Menu, X, CircuitBoard, Shield } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/book-online', label: 'Book Online' },
  { to: '/jobs', label: 'Careers' },
  { to: '/blank-page', label: 'About Us' },
];

export const SiteHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { company } = useCompany();
  const { isAuthed } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CircuitBoard className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="font-display text-sm font-bold leading-tight tracking-tight sm:text-base">
            PRAYAG <span className="text-primary">TECHNO</span> SOLUTIONS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'bg-secondary text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {company.facebook && (
            <a
              href={company.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${company.company_name} on Facebook`}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Facebook className="h-5 w-5" strokeWidth={1.8} />
            </a>
          )}

          {isAuthed && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}

          <Link
            to="/book-online"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-3 text-sm font-medium text-muted-foreground',
                  isActive && 'bg-secondary text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            {isAuthed && (
              <Link
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-border text-sm font-medium text-muted-foreground"
              >
                <Shield className="h-4 w-4" /> Admin Dashboard
              </Link>
            )}
            <Link
              to="/book-online"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
            >
              Book Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
