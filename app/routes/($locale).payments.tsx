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
    setCurrentPage('Payments Policy');
  }, []);

  return (
    <div className="payments">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">{t('Payments Policy')}</h1>
          <p className="text-medium">
            {t('Effective date: February 22, 2024')}
          </p>
        </div>
        <div className="flex items-start justify-start flex-col sm:flex-row w-full gap-8 sm:gap-18 lg:gap-54">
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div className="flex flex-col text-sm sm:text-base gap-6">
              <p className="text-justify">{t('payments_policy_desc_one')}</p>
              <p className="text-justify">{t('payments_policy_desc_two')}</p>
              <p className="text-justify">{t('payments_policy_desc_three')}</p>
              <p className="text-justify">{t('payments_policy_desc_four')}</p>
              <p className="text-justify">{t('payments_policy_desc_five')}</p>
              <p className="text-justify">{t('payments_policy_desc_six')}</p>
              <p className="text-justify">{t('payments_policy_desc_seven')}</p>
              <p className="text-justify">{t('payments_policy_desc_eight')}</p>
              <p className="text-justify">
                {t('payments_policy_desc_nine')}{' '}
                <Link
                  className="hover:underline"
                  to="mailto:customercare@mariobologna.net"
                  target="_blank"
                >
                  customercare@mariobologna.net
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
