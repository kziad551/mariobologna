import {AnimatePresence, motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const COOKIE_CONSENT_KEY = 'mariobologna_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0'; // Increment this when cookie policy changes

interface CookieConsentData {
  accepted: boolean;
  version: string;
  timestamp: string;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      const consentData = consent ? (JSON.parse(consent) as CookieConsentData) : null;
      
      // Show banner if no consent or if version is outdated
      if (!consentData || consentData.version !== COOKIE_CONSENT_VERSION) {
        setShowBanner(true);
      }
    } catch (error) {
      // If localStorage is not available or parsing fails, show the banner
      console.warn('Cookie consent check failed:', error);
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          accepted: true,
          version: COOKIE_CONSENT_VERSION,
          timestamp: new Date().toISOString(),
        }),
      );
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
