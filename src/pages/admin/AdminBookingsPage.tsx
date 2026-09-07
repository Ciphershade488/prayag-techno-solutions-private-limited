import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  CalendarCheck,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from 'lucide-react';
import { api, Booking } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const AdminBookingsPage: React.FC = () => {
  const { company } = useCompany();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await api.getAdminBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setStatusUpdating(id);
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error('Failed to update booking status:', err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Helmet>
        <title>Client Bookings — {company.company_name}</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Client Consultation Bookings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Customer consultation requests submitted via the Book Online page.
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="text"
            placeholder="Search by client name, email, phone, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-slate-800 bg-slate-950 pl-9 text-sm text-white placeholder:text-slate-500"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm">Loading bookings...</p>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-semibold">Client Details</th>
                    <th className="px-4 py-3.5 font-semibold">Service Requested</th>
                    <th className="px-4 py-3.5 font-semibold">Preferred Slot</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-slate-900/40">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{b.name}</div>
                        <div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3" /> {b.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" /> {b.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-300">
                          {b.service}
                        </span>
                        {b.message && (
                          <div className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            "{b.message}"
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>{b.preferred_date || 'Flexible'}</span>
                        </div>
                        {b.preferred_time && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span>{b.preferred_time}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : b.status === 'completed'
                              ? 'bg-blue-500/15 text-blue-400'
                              : b.status === 'cancelled'
                              ? 'bg-rose-500/15 text-rose-400'
                              : 'bg-amber-500/15 text-amber-300'
                          )}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select
                          value={b.status}
                          disabled={statusUpdating === b.id}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center text-slate-400">
            <CalendarCheck className="mx-auto h-10 w-10 text-slate-600" />
            <h3 className="mt-3 font-display text-base font-bold text-white">No bookings found</h3>
            <p className="mt-1 text-xs text-slate-400">
              New consultation submissions will appear here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBookingsPage;
