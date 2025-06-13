import {Link} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'Accessibility Policy - Mario Bologna'},
    {name: 'description', content: 'Learn about Mario Bologna\'s commitment to web accessibility and our efforts to ensure an inclusive shopping experience for all customers.'},
    {name: 'keywords', content: 'accessibility, web accessibility, inclusive shopping, disability access, Mario Bologna'},
  ];
};

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
        <section aria-labelledby="accessibility-intro">
          <h2 id="accessibility-intro" className="text-2xl font-medium mb-4">
            {t('Our Commitment to Accessibility')}
          </h2>
          <p className="text-justify">{t('accessibility_first_sentence')}</p>
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{__html: t('accessibility_second_sentence')}}
          ></p>
        </section>

        <section aria-labelledby="accessibility-features">
          <h2 id="accessibility-features" className="text-2xl font-medium mb-4">
            {t('Accessibility Features')}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('Keyboard navigation support')}</li>
            <li>{t('Screen reader compatibility')}</li>
            <li>{t('High contrast text options')}</li>
            <li>{t('Alternative text for images')}</li>
          </ul>
        </section>

        <section aria-labelledby="contact-section">
          <h2 id="contact-section" className="text-2xl font-medium mb-4">
            {t('Contact Us')}
          </h2>
          <p className="mb-4">
            {t('If you encounter any accessibility issues or have suggestions for improvement, please contact our customer care team.')}
          </p>
          <Link
            className="w-fit px-6 py-2.5 font-medium text-sm bg-primary-P-40 text-white border border-transparent rounded-md hover:bg-primary-P-50 transition-colors"
            to="mailto:customercare@mariobologna.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Contact Us')}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Accessibility;
