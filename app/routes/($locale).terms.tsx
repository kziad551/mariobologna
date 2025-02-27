import {AnimatePresence, motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {useCustomContext} from '~/contexts/App';
import {IoIosArrowDown} from 'react-icons/io';
import {useTranslation} from 'react-i18next';
import {Link} from '@remix-run/react';

const Privacy = () => {
  const {setCurrentPage} = useCustomContext();
  const [active, setActive] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('Terms & Conditions');
  }, []);

  return (
    <div className="terms">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">{t('Terms & Conditions')}</h1>
          <p className="text-medium">
            {t('Effective date: February 22, 2024')}
          </p>
        </div>
        <div className="flex items-start justify-start flex-col sm:flex-row w-full gap-8 sm:gap-18 lg:gap-54">
          <div className="sticky top-34.5 hidden sm:flex flex-col items-start gap-4 min-w-50">
            <Link to="" className="text-xl">
              {t('Table Of Contents')}
            </Link>
            <div className="flex flex-col">
              <Link to="#acceptance" className="text-sm px-4 py-2">
                {t('Acceptance of Website Terms')}
              </Link>
              <Link to="#property_rights" className="text-sm px-4 py-2">
                {t('Intellectual Property Rights')}
              </Link>
              <Link to="#privacy_cookies" className="text-sm px-4 py-2">
                {t('Privacy & Cookies Policy')}
              </Link>
              <Link to="#severability" className="text-sm px-4 py-2">
                {t('Severability Clause')}
              </Link>
              <Link to="#law" className="text-sm px-4 py-2">
                {t('Disputes and Governing Law')}
              </Link>
            </div>
          </div>
          <div className="w-full flex sm:hidden flex-col items-stretch gap-3">
            <button
              className="flex items-center gap-3 border border-black justify-between py-3 px-4"
              onClick={() => setActive(!active)}
            >
              <p>{t('Table Of Contents')}</p>
              <IoIosArrowDown
                className={`${active ? 'rotate-180' : ''} w-6 h-6 transition-transform`}
              />
            </button>
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{height: 0}}
                  animate={{height: 'auto'}}
                  exit={{height: 0}}
                  className="z-10 flex flex-col items-stretch overflow-hidden"
                >
                  <Link to="#acceptance" className="text-sm px-4 py-2">
                    {t('Acceptance of Website Terms')}
                  </Link>
                  <Link to="#property_rights" className="text-sm px-4 py-2">
                    {t('Intellectual Property Rights')}
                  </Link>
                  <Link to="#privacy_cookies" className="text-sm px-4 py-2">
                    {t('Privacy & Cookies Policy')}
                  </Link>
                  <Link to="#severability" className="text-sm px-4 py-2">
                    {t('Severability Clause')}
                  </Link>
                  <Link to="#law" className="text-sm px-4 py-2">
                    {t('Disputes and Governing Law')}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('terms_desc_one')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('terms_desc_two')}}
              ></p>
            </div>
            <div id="acceptance" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Acceptance of Website Terms')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('acceptance_desc')}</p>
              </div>
            </div>
            <div id="property_rights" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Intellectual Property Rights')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('property_rights_desc_one')}</p>
                <p className="text-justify">{t('property_rights_desc_two')}</p>
              </div>
            </div>
            <div id="privacy_cookies" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Privacy & Cookies Policy')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">
                  {t('terms_privacy_cookies_desc_one')}{' '}
                  <Link
                    to="/privacy_and_cookies"
                    className="font-semibold hover:underline"
                  >
                    {t('Privacy & Cookies Policy')}
                  </Link>
                  .
                </p>
                <p className="text-justify">
                  {t('terms_privacy_cookies_desc_two')}{' '}
                  <Link
                    to="/privacy_and_cookies"
                    className="font-semibold hover:underline"
                  >
                    {t('Privacy & Cookies Policy')}
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div id="severability" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Severability Clause')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('severability_desc')}</p>
              </div>
            </div>
            <div id="law" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Disputes and Governing Law')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('terms_law_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
