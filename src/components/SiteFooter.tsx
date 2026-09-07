import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, MapPin, Clock, CircuitBoard, Shield } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { SERVICES } from '@/lib/site';

export const SiteFooter: React.FC = () => {
  const { company } = useCompany();

  return (
    <footer className="bg-[hsl(222,47%,9%)] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CircuitBoard className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="font-display text-sm font-bold text-white">
              PRAYAG <span className="text-blue-400">TECHNO</span> SOLUTIONS
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {company.tagline || 'IT Services, HR Services & BPO Solutions'}. Delivering tailored solutions to clients across India since 2017.
          </p>
          {company.facebook && (
            <a
              href={company.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-400"
            >
              <Facebook className="h-4 w-4" /> Follow us on Facebook
            </a>
          )}
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
            <li><Link to="/book-online" className="transition-colors hover:text-white">Book Online</Link></li>
            <li><Link to="/jobs" className="transition-colors hover:text-white">Careers / Jobs</Link></li>
            <li><Link to="/blank-page" className="transition-colors hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {SERVICES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Contact Details
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-white">
                {company.email}
              </a>
            </li>
            {company.phones?.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <a href={`tel:${p.replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-white">
                  {p}
                </a>
              </li>
            ))}
            {company.addresses?.map((a) => (
              <li key={a.label + a.line} className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>
                  <span className="font-medium text-white">{a.label}: </span>
                  {a.line}
                </span>
              </li>
            ))}
            {company.hours && (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>{company.hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row">
          <span>
            © {new Date().getFullYear()} {company.legal_name || company.company_name}. All rights reserved.
          </span>
          <span>
            Data protected under standard corporate & privacy norms.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
