import {NavLink} from '@remix-run/react';
import {TFunction} from 'i18next';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FaRegClock} from 'react-icons/fa';
import {LuMapPin} from 'react-icons/lu';
import {useCustomContext} from '~/contexts/App';
import type {MetaFunction} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {title: 'Career Opportunities | Mario Bologna Moda - Fashion Industry Jobs'},
    {name: 'description', content: 'Explore exciting career opportunities at Mario Bologna Moda. Join our team of fashion professionals in luxury fashion design, sustainable fashion, and innovative clothing production.'},
    {name: 'keywords', content: 'fashion careers, luxury fashion jobs, fashion industry jobs, Mario Bologna Moda careers, fashion design jobs, sustainable fashion careers, fashion production jobs, fashion marketing careers'},
    {property: 'og:title', content: 'Career Opportunities | Mario Bologna Moda - Fashion Industry Jobs'},
    {property: 'og:description', content: 'Explore exciting career opportunities at Mario Bologna Moda. Join our team of fashion professionals in luxury fashion design, sustainable fashion, and innovative clothing production.'},
    {property: 'og:type', content: 'website'},
    {name: 'robots', content: 'index, follow'},
  ];
};

type JobType = {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  contractType: string;
};

const jobs: JobType[] = [
  {
    id: 1,
    title: 'Job Title',
    category: 'Department',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    location: 'Location',
    contractType: 'Contract Type',
  },
  {
    id: 2,
    title: 'Job Title',
    category: 'Department',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    location: 'Location',
    contractType: 'Contract Type',
  },
  {
    id: 3,
    title: 'Job Title',
    category: 'Department',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    location: 'Location',
    contractType: 'Contract Type',
  },
];

const Career = () => {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('Open Positions');
  }, []);

  return (
    <div className="career">
      <div className="py-3 px-4 sm:py-36 sm:px-8 flex flex-col items-stretch justify-start gap-5 sm:gap-20">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-medium hidden sm:block">
            {t('Open Positions')}
          </h1>
          <div>
            <p>{t("Currently, we do not have any open positions.")}</p>
            <p>{t("Please check back soon for future opportunities.")}</p>
          </div>
          {/* Hidden SEO content with proper heading hierarchy and links */}
          <div className="hidden" aria-hidden="true">
            <h1>Career Opportunities at Mario Bologna Moda</h1>
            <p>Mario Bologna Moda is a leading luxury fashion house offering exciting career opportunities in the fashion industry. We are committed to innovation, creativity, and excellence in fashion design and production.</p>
            
            <h2>Why Join Mario Bologna Moda?</h2>
            <p>As a premier fashion house, we offer unique opportunities for growth and development in the fashion industry. Our commitment to sustainable fashion and innovative design makes us a leader in the luxury fashion market.</p>
            
            <h3>Our Fashion Industry Expertise</h3>
            <p>With decades of experience in luxury fashion, we specialize in:</p>
            <ul>
              <li>High-end fashion design</li>
              <li>Sustainable fashion production</li>
              <li>Luxury fashion marketing</li>
              <li>Fashion technology innovation</li>
            </ul>

            <h3>Career Development at Mario Bologna Moda</h3>
            <p>We invest in our team's professional growth through:</p>
            <ul>
              <li>Fashion industry training programs</li>
              <li>International fashion exposure</li>
              <li>Creative collaboration opportunities</li>
              <li>Leadership development initiatives</li>
            </ul>

            <h4>Our Fashion Industry Values</h4>
            <ul>
              <li>Innovation in fashion design</li>
              <li>Quality craftsmanship</li>
              <li>Sustainable fashion practices</li>
              <li>Professional development</li>
              <li>Creative collaboration</li>
            </ul>

            <h4>Fashion Industry Partnerships</h4>
            <p>We collaborate with leading organizations in the fashion industry:</p>
            <ul>
              <li><a href="https://www.fashionrevolution.org" rel="noopener noreferrer">Fashion Revolution</a> - Promoting sustainable fashion</li>
              <li><a href="https://www.cfda.com" rel="noopener noreferrer">Council of Fashion Designers of America</a> - Fashion industry standards</li>
            </ul>

            <h4>Internal Resources</h4>
            <ul>
              <li><NavLink to="/about">About Our Fashion House</NavLink></li>
              <li><NavLink to="/sustainability">Our Sustainable Fashion Initiatives</NavLink></li>
              <li><NavLink to="/contact">Contact Our Fashion Team</NavLink></li>
            </ul>

            <p>Join our team of passionate fashion professionals and contribute to our legacy of excellence in the fashion industry. At Mario Bologna Moda, we're shaping the future of luxury fashion through innovation, sustainability, and creative excellence.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type PositionSectionType = {
  jobs: JobType[];
  t: TFunction<'translation', undefined>;
};

const PositionSection = ({jobs, t}: PositionSectionType) => {
  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8">
      {jobs.map((jobs) => (
        <div key={jobs.id} className="border-t border-black pt-8">
          <div className="flex items-center justify-start gap-4 mb-4">
            <p className="sm:text-xl">{jobs.title}</p>
            <p className="text-sm font-medium py-1 px-2">{jobs.category}</p>
          </div>
          <p className="max-w-190 mb-6">{jobs.description}</p>
          <div className="flex items-center justify-start gap-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <LuMapPin className="min-w-6.25 min-h-6.25" />
              <p className="text-sm sm:text-base">{jobs.location}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaRegClock className="min-w-6.25 min-h-6.25" />
              <p className="text-sm sm:text-base">{jobs.contractType}</p>
            </div>
          </div>
          <button className="bg-transparent text-primary-P-40 border border-primary-P-40 rounded-md text-sm font-medium px-6 py-2.5">
            {t('Apply Now')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Career;
