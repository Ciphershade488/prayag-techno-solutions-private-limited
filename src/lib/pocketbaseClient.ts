export interface JobRecord {
  id: string;
  collectionId?: string;
  collectionName?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'published' | 'draft' | 'archived';
  description: string;
  created: string;
  updated: string;
}

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created: string;
  updated: string;
}

export interface JobApplicationRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  experience_years: string;
  location: string;
  portfolio_url?: string;
  cover_letter?: string;
  resume_text?: string;
  created: string;
  updated: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  created?: string;
}

const INITIAL_JOBS: JobRecord[] = [
  {
    id: "wp9dugnhxoox8gh",
    title: "IT Support Engineer",
    department: "IT Services",
    location: "Prayagraj, U.P.",
    type: "Full-time",
    status: "published",
    description: "Provide laptop, desktop and server support, AMC services, remote and onsite troubleshooting and data recovery for our clients.",
    created: "2026-09-07 07:49:09.121Z",
    updated: "2026-09-07 07:49:09.121Z"
  },
  {
    id: "8crjinhv7efktts",
    title: "HR Executive",
    department: "HR & BPO",
    location: "Prayagraj / Kochi",
    type: "Full-time",
    status: "published",
    description: "Manage human resource services, employee management, MIS work and back-office operations across our client base.",
    created: "2026-09-07 07:49:09.122Z",
    updated: "2026-09-07 07:49:09.122Z"
  },
  {
    id: "mqan5hd72771oey",
    title: "BPO / Data Entry Executive",
    department: "HR & BPO",
    location: "Prayagraj, U.P.",
    type: "Full-time",
    status: "published",
    description: "Handle BPO services, data entry and data processing, translation work and client services with accuracy and speed.",
    created: "2026-09-07 07:49:09.122Z",
    updated: "2026-09-07 07:49:09.122Z"
  },
  {
    id: "okghr9rpl0bqe44",
    title: "GeM Consultant",
    department: "GeM Services",
    location: "Prayagraj / Remote",
    type: "Full-time",
    status: "published",
    description: "Guide clients through GeM registration, product listing, tender analysis and bidding, legal compliance and sales growth analysis.",
    created: "2026-09-07 07:49:09.122Z",
    updated: "2026-09-07 07:49:09.122Z"
  }
];

function getStored<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

class PocketBaseMock {
  private listeners: Array<(token: string, record: UserRecord | null) => void> = [];

  authStore = {
    record: getStored<UserRecord | null>('pts_auth_user', {
      id: 'admin-pts-1',
      email: 'admin@prayagtechno.com',
      name: 'Administrator',
      role: 'admin',
    }),
    get isValid(): boolean {
      return Boolean(this.record);
    },
    onChange: (cb: (token: string, record: UserRecord | null) => void) => {
      this.listeners.push(cb);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== cb);
      };
    },
    clear: () => {
      this.authStore.record = null;
      setStored('pts_auth_user', null);
      this.listeners.forEach((cb) => cb('', null));
    },
    save: (_token: string, record: UserRecord | null) => {
      this.authStore.record = record;
      setStored('pts_auth_user', record);
      this.listeners.forEach((cb) => cb(_token, record));
    }
  };

  collection(name: string) {
    const storageKey = `pts_${name}`;

    return {
      getFullList: async (options?: { sort?: string; filter?: string; requestKey?: string }) => {
        let items: any[] = [];
        if (name === 'jobs') {
          items = getStored<JobRecord[]>(storageKey, INITIAL_JOBS);
        } else if (name === 'bookings') {
          items = getStored<BookingRecord[]>(storageKey, []);
        } else if (name === 'job_applications') {
          items = getStored<JobApplicationRecord[]>(storageKey, []);
        } else {
          items = getStored<any[]>(storageKey, []);
        }

        // Apply filter if specified
        if (options?.filter) {
          if (options.filter.includes("status = 'published'")) {
            items = items.filter((i) => i.status === 'published');
          }
        }

        // Apply sort if specified
        if (options?.sort === '-created') {
          items = [...items].sort((a, b) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime());
        }

        return items;
      },

      create: async (payload: any, _options?: { requestKey?: string }) => {
        let items: any[] = [];
        if (name === 'jobs') {
          items = getStored<JobRecord[]>(storageKey, INITIAL_JOBS);
        } else {
          items = getStored<any[]>(storageKey, []);
        }

        const now = new Date().toISOString();
        const record = {
          id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
          created: now,
          updated: now,
          status: name === 'bookings' ? 'pending' : (name === 'jobs' ? 'published' : undefined),
          ...payload,
        };

        items.unshift(record);
        setStored(storageKey, items);
        return record;
      },

      update: async (id: string, payload: any, _options?: { requestKey?: string }) => {
        let items: any[] = [];
        if (name === 'jobs') {
          items = getStored<JobRecord[]>(storageKey, INITIAL_JOBS);
        } else {
          items = getStored<any[]>(storageKey, []);
        }

        const index = items.findIndex((i) => i.id === id);
        if (index === -1) {
          throw new Error(`Record with id ${id} not found in collection ${name}`);
        }

        const updated = {
          ...items[index],
          ...payload,
          updated: new Date().toISOString(),
        };

        items[index] = updated;
        setStored(storageKey, items);
        return updated;
      },

      delete: async (id: string, _options?: { requestKey?: string }) => {
        let items: any[] = [];
        if (name === 'jobs') {
          items = getStored<JobRecord[]>(storageKey, INITIAL_JOBS);
        } else {
          items = getStored<any[]>(storageKey, []);
        }

        items = items.filter((i) => i.id !== id);
        setStored(storageKey, items);
        return true;
      },

      authWithPassword: async (email: string, _password: string) => {
        const user: UserRecord = {
          id: 'admin-' + Math.random().toString(36).substring(2, 7),
          email,
          name: email.split('@')[0],
          role: 'admin',
          created: new Date().toISOString(),
        };
        this.authStore.save('mock-token-xyz', user);
        return {
          token: 'mock-token-xyz',
          record: user,
        };
      },
    };
  }
}

export const pocketbaseClient = new PocketBaseMock();
export default pocketbaseClient;
