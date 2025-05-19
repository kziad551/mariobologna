import {Link, type MetaFunction} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';

export const meta: MetaFunction = () => {
  return [
    { title: 'About Us | Mario Bologna - House of Brands' },
    { name: 'description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence offering curated fashion collections for men, women, and kids.' },
    { name: 'keywords', content: 'Mario Bologna history, fashion brand, luxury retail, about Mario Bologna, fashion house history' },
    { property: 'og:title', content: 'About Us | Mario Bologna - House of Brands' },
    { property: 'og:description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence offering curated fashion collections.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'About Us | Mario Bologna - House of Brands' },
    { name: 'twitter:description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence.' },
    { name: 'robots', content: 'index, follow' },
  ];
};

const AboutUs = () => {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('About Us');
  }, []);

  return (
    <div className="about_us">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">{t('Mario Bologna')}</h1>
          <p className="text-medium">
            {t('Welcome to Mario Bologna - House of Brands!')}
          </p>
        </div>
        <div className="flex items-start justify-start flex-col sm:flex-row w-full gap-8 sm:gap-18 lg:gap-54">
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div className="flex flex-col text-sm sm:text-base gap-6">
              <p className="text-justify">{t('about_us_desc_one')}</p>
              <p className="text-justify">{t('about_us_desc_two')}</p>
              <p className="text-justify">{t('about_us_desc_three')}</p>
              {/* <p className="text-justify">{t('about_us_desc_four')}</p> */}
              {/* <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_five')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_six')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_seven')}}
              ></p> */}
              {/* <p className="text-justify">
                {t(
                  '(Presence Projection: Figures to be added in circular frame, Text below for each):',
                )}
              </p> */}
              {/* <ul className="">
                <li className="text-justify">
                  {t('33 Years: Celebrating Retail Excellence!')}
                </li>
                <li className="text-justify">
                  {t('15 Brands: Handpicked for your desire')}
                </li>
                <li className="text-justify">
                  {t('85,808 Articles: Tell the Tale of success')}
                </li>
                <li className="text-justify">
                  {t('503,801 Valued Customers: ... and growing!')}
                </li>
              </ul> */}
              {/* <p
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html: t('Phrases to use over sliders:'),
                }}
              ></p> */}
              {/* <ul className="">
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_one')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_two')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_three')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_four')}}
                ></li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
