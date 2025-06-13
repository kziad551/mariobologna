import {Link} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'Sustainability - Mario Bologna Moda'},
    {name: 'description', content: 'Discover Mario Bologna Moda\'s commitment to sustainability through traditional craftsmanship and innovative practices. Learn about our environmental initiatives and community impact.'},
    {name: 'keywords', content: 'sustainability, eco-friendly fashion, sustainable luxury, traditional craftsmanship, environmental impact, community development, ethical fashion, Mario Bologna Moda'},
    {name: 'robots', content: 'index, follow'},
  ];
};

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
          <section id="tradition_sustainability" className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {t('Sustainability Through Tradition and Innovation')}
            </h2>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">{t('tradition_desc_one')}</p>
              <p className="text-justify">{t('tradition_desc_two')}</p>
              <div className="sr-only">
                <Link to="/about">
                  {t('Learn more about our heritage')}
                </Link>
              </div>
            </div>
          </section>
          <section id="community_sustainability" className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {t('Impact on Community and Environment')}
            </h2>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">{t('community_desc_one')}</p>
              <p className="text-justify">{t('community_desc_two')}</p>
              <div className="sr-only">
                <Link to="/contact">
                  {t('Join our sustainability initiatives')}
                </Link>
                <a 
                  href="https://www.un.org/sustainabledevelopment/sustainable-development-goals/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('Learn about UN Sustainable Development Goals')}
                </a>
              </div>
            </div>
          </section>
          <section id="certifications" className="flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t('Our Certifications and Standards')}
            </h3>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">
                {t('We are proud to maintain the highest standards of sustainability and ethical practices in our industry.')}
              </p>
              <div className="sr-only">
                <Link to="/certifications">
                  {t('View our certifications')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default sustainability;
