import {AnimatePresence, motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
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
