export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  salary?: string | null;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  skills?: string | null;
  application_email?: string | null;
  application_link?: string | null;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CompanyDetails {
  id: string;
  company_name: string;
  legal_name: string;
  short_name: string;
  tagline: string;
  about: string;
  phone: string;
  phones: string[];
  email: string;
  address: string;
  addresses: Array<{ label: string; line: string }>;
  website?: string;
  facebook?: string;
  hours?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalBookings: number;
  pendingBookings: number;
  totalApplications: number;
  recentJobs: Job[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id?: string | null;
  role: string;
  full_name: string;
  email: string;
  phone: string;
  experience_years?: string;
  location?: string;
  portfolio_url?: string;
  cover_letter?: string;
  resume_text?: string;
  created_at: string;
}

const TOKEN_KEY = 'pts_admin_token';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  clearToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  // Authentication
  login: (credentials: { email?: string; username?: string; password: string }) =>
    apiRequest<{ success: boolean; token: string; user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () =>
    apiRequest<{ user: AdminUser }>('/api/auth/me'),

  logout: () =>
    apiRequest<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  // Public Jobs & Company
  getPublicJobs: () =>
    apiRequest<Job[]>('/api/jobs'),

  getPublicJobById: (id: string) =>
    apiRequest<Job>(`/api/jobs/${id}`),

  getCompanyDetails: () =>
    apiRequest<CompanyDetails>('/api/company'),

  // Public Bookings & Applications
  submitBooking: (booking: Partial<Booking>) =>
    apiRequest<{ success: boolean; record: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),

  submitJobApplication: (app: Partial<JobApplication>) =>
    apiRequest<{ success: boolean; record: JobApplication }>('/api/job-applications', {
      method: 'POST',
      body: JSON.stringify(app),
    }),

  // Admin Endpoints
  getAdminStats: () =>
    apiRequest<AdminStats>('/api/admin/stats'),

  getAdminJobs: () =>
    apiRequest<Job[]>('/api/admin/jobs'),

  getAdminJobById: (id: string) =>
    apiRequest<Job>(`/api/admin/jobs/${id}`),

  createJob: (job: Partial<Job>) =>
    apiRequest<Job>('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    }),

  updateJob: (id: string, job: Partial<Job>) =>
    apiRequest<Job>(`/api/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    }),

  toggleJobStatus: (id: string, status?: 'active' | 'closed') =>
    apiRequest<Job>(`/api/admin/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteJob: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    }),

  getAdminCompanyDetails: () =>
    apiRequest<CompanyDetails>('/api/admin/company'),

  updateCompanyDetails: (details: Partial<CompanyDetails>) =>
    apiRequest<CompanyDetails>('/api/admin/company', {
      method: 'PUT',
      body: JSON.stringify(details),
    }),

  getAdminBookings: () =>
    apiRequest<Booking[]>('/api/admin/bookings'),

  updateBookingStatus: (id: string, status: string) =>
    apiRequest<Booking>(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getAdminApplications: () =>
    apiRequest<JobApplication[]>('/api/admin/job-applications'),
};
