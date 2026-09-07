import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, CompanyDetails } from '@/lib/api';
import { SITE } from '@/lib/site';

interface CompanyContextType {
  company: CompanyDetails;
  loading: boolean;
  refreshCompany: () => Promise<void>;
}

const defaultCompany: CompanyDetails = {
  id: 'company-main',
  company_name: SITE.name,
  legal_name: SITE.legalName,
  short_name: SITE.shortName,
  tagline: SITE.tagline,
  about: "We're PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED, and we can't wait to start working together. Your vision is important to us — we map out the needs of your business and provide the necessary tools to achieve a successful future.",
  phone: SITE.phone,
  phones: SITE.phones,
  email: SITE.email,
  address: SITE.address,
  addresses: SITE.addresses,
  website: 'https://prayagtechno.com',
  facebook: SITE.facebook,
  hours: SITE.hours,
};

const CompanyContext = createContext<CompanyContextType>({
  company: defaultCompany,
  loading: false,
  refreshCompany: async () => {},
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanyDetails>(defaultCompany);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    try {
      const data = await api.getCompanyDetails();
      if (data && data.company_name) {
        setCompany(data);
      }
    } catch (err) {
      console.warn('Using default company configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return (
    <CompanyContext.Provider value={{ company, loading, refreshCompany: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
