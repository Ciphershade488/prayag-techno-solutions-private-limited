export interface SiteAddress {
  label: string;
  line: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  shortName: string;
  tagline: string;
  since: number;
  email: string;
  phones: string[];
  phone: string;
  addresses: SiteAddress[];
  address: string;
  facebook: string;
  hours: string;
}

export const SITE: SiteConfig = {
  name: 'PRAYAG TECHNO SOLUTIONS',
  legalName: 'PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED',
  shortName: 'Prayag Techno',
  tagline: 'IT Services, HR Services & BPO Solutions',
  since: 2017,
  email: 'pts.info@mail.com',
  phones: ['+91-9336737908', '+91-8800646846'],
  phone: '+91-9336737908',
  addresses: [
    { label: 'Corporate Office', line: '53C/12D, M.L.N. Road, Prayagraj (Allahabad), U.P. – 211002' },
    { label: 'Branch Office', line: '620/489B, Mumfordganj, Prayagraj (Allahabad), U.P. – 211002' },
    { label: 'Business Center', line: '11/1315, Fort Kochi, Ernakulam, Kerala – 682001' },
  ],
  address: '53C/12D, M.L.N. Road, Prayagraj (Allahabad), U.P. – 211002',
  facebook: 'https://www.facebook.com/prayagtechnosolutions',
  hours: 'Monday – Saturday, 09:30 – 18:30 IST',
};

export const SERVICES = [
  'GeM Consultancy',
  'IT Services',
  'HR & BPO Services',
  'CSR Procurement Strategy Consulting',
  'Website Monitoring',
  'Tech Support',
  'Web Development & Design',
];

export const TIME_SLOTS = [
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const JOB_ROLES = [
  'IT Support Engineer',
  'HR Executive',
  'BPO / Data Entry Executive',
  'GeM Consultant',
  'Business Development Manager (BDM)',
  'Web Developer',
  'Other / General Application',
];
