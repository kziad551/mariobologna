import {AnimatePresence, motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

const COOKIE_CONSENT_KEY = 'mariobologna_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0'; // Increment this when cookie policy changes
const COOKIE_EXPIRY_DAYS = 365; // 1 year

interface CookieConsentData {
  accepted: boolean;
  version: string;
  timestamp: string;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    // Check for consent in both cookies and localStorage for maximum compatibility
    const hasConsent = checkConsent();
    setShowBanner(!hasConsent);
  }, []);

  // Check if valid consent exists in either cookies or localStorage
  const checkConsent = (): boolean => {
    try {
      // Check cookies first (more reliable)
      const cookieConsent = Cookies.get(COOKIE_CONSENT_KEY);
      if (cookieConsent) {
        const consentData = JSON.parse(cookieConsent) as CookieConsentData;
        if (consentData.accepted && consentData.version === COOKIE_CONSENT_VERSION) {
          return true;
        }
      }

      // Fallback to localStorage
      const localConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (localConsent) {
        const consentData = JSON.parse(localConsent) as CookieConsentData;
        if (consentData.accepted && consentData.version === COOKIE_CONSENT_VERSION) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.warn('Cookie consent check failed:', error);
      return false;
    }
  };

  const handleAccept = () => {
    try {
      const consentData: CookieConsentData = {
        accepted: true,
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      };
      
      // Store in cookies with proper expiration (1 year)
      Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(consentData), { 
        expires: COOKIE_EXPIRY_DAYS,
        path: '/',
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:'
      });
      
      // Backup in localStorage
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
      
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
      // Still hide the banner even if storage fails
      setShowBanner(false);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{
            y: '100%',
          }}
          animate={{
            y: 0,
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
              bounce: 0.25,
              bounceStiffness: 500,
              bounceDamping: 10,
              delay: 2,
            },
          }}
          exit={{
            y: '100%',
          }}
          className="fixed bottom-0 w-full bg-[#F5F5F5] shadow-[0_0_12px_-4px_#0005] text-black px-8 py-4 z-[99] flex flex-col gap-2"
        >
          <h2 className="text-2xl">{t('We value your privacy')}</h2>
          <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-10">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{__html: t('cookies_desc')}}
            />
            <button
              onClick={handleAccept}
              className="bg-green-700 text-nowrap rounded-md text-white border-0 px-12 py-2.5 cursor-pointer transition-colors hover:bg-green-900"
            >
              {t('Accept All')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
