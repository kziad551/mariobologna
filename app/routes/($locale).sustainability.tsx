import {Link} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';

const sustainability = () => {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('Sustainability');
  }, []);

  return (
    <div className="sustainability">
      <div className="max-w-230 py-3 px-4 sm:py-36 sm:px-8 flex flex-col items-stretch justify-start gap-6">
        <h1 className="text-5xl font-medium hidden sm:block">
          {t('Sustainability')}
        </h1>
        <div className="flex flex-col items-start gap-10">
          <div id="tradition_sustainability" className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {t('Sustainability Through Tradition and Innovation')}
            </h2>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">{t('tradition_desc_one')}</p>
              <p className="text-justify">{t('tradition_desc_two')}</p>
            </div>
          </div>
          <div id="community_sustainability" className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {t('Impact on Community and Environment')}
            </h2>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">{t('community_desc_one')}</p>
              <p className="text-justify">{t('community_desc_two')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sustainability;
