import {Link} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';

const Accessibility = () => {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('Accessibility');
  }, []);

  return (
    <div className="accessibility">
      <div className="max-w-230 py-3 px-4 sm:py-36 sm:px-8 flex flex-col items-stretch justify-start gap-6">
        <h1 className="text-5xl font-medium hidden sm:block">
          {t('Accessibility')}
        </h1>
        <p className="text-justify">{t('accessibility_first_sentence')}</p>
        <p
          className="text-justify"
          dangerouslySetInnerHTML={{__html: t('accessibility_second_sentence')}}
        ></p>
        <Link
          className="w-fit px-6 py-2.5 font-medium text-sm bg-primary-P-40 text-white border border-transparent rounded-md"
          to="mailto:customercare@mariobologna.net"
          target="_blank"
        >
          {t('Contact Us')}
        </Link>
      </div>
    </div>
  );
};

export default Accessibility;
