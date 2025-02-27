import {NavLink} from '@remix-run/react';
import {TFunction} from 'i18next';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FaRegClock} from 'react-icons/fa';
import {LuMapPin} from 'react-icons/lu';
import {useCustomContext} from '~/contexts/App';

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
          {/* <p className="">
            {t(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
            )}
          </p> */}
        </div>
        {/* <PositionSection t={t} jobs={jobs} /> */}
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
