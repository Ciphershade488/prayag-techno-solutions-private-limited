import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'pts-cookie-consent';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch (_) {
      setVisible(true);
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {
      /* storage unavailable — banner simply hides for this session */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 shadow-[0_-8px_30px_rgba(2,6,23,0.12)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use only essential cookies to make this website work and, with your
            consent, optional analytics cookies to improve it. You can accept or
            decline optional cookies — your choice is stored on this device and no
            personal data is shared without consent, in line with the GDPR.
          </p>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-auto">
          <button
            onClick={() => choose('declined')}
            className="h-11 flex-1 rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary md:flex-none"
          >
            Decline
          </button>
          <button
            onClick={() => choose('accepted')}
            className="h-11 flex-1 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] md:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
