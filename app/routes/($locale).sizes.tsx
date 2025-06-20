import {
  Link,
  MetaFunction,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import React, {useEffect, useState} from 'react';
import {IoIosArrowForward} from 'react-icons/io';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {defer, LoaderFunctionArgs} from '@remix-run/server-runtime';
import {TFunction} from 'i18next';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: 'Size Guide'}];
};

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const guide = queryParams.get('guide');
  const section = queryParams.get('section');

  return defer({guide, section});
}

/* **************************** */
/* *********WOMEN DATA********* */
/* **************************** */
const WOMEN_CLOTHES_SIZES = [
  'S',
  'M',
  'M',
  'L',
  'L',
  'XL',
  'XL',
  '2XL',
  '3XL',
  '4XL',
];
const WOMEN_CLOTHES_EU_SIZES = [36, 38, 40, 42, 44, 46, 48, 50, 52, 54];
const WOMEN_CLOTHES_UK_SIZES = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
const WOMEN_CLOTHES_US_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
const WOMEN_FOOTWEAR_EU_SIZES = [
  35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42,
];
const WOMEN_FOOTWEAR_UK_SIZES = [
  2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
];
const WOMEN_FOOTWEAR_US_SIZES = [
  '4.5-5',
  5,
  5.5,
  6,
  6.5,
  7,
  7.5,
  8,
  8.5,
  9,
  9.5,
  10,
  10.5,
  11,
  11.5,
];
const WOMEN_BELTS_SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const WOMEN_BELTS_EU_SIZES_INCH = [34, 38, 42, 46, 48];
const WOMEN_BELTS_EU_SIZES_CM = [85, 95, 105, 115, 120];

/* **************************** */
/* **********MEN DATA********** */
/* **************************** */
const MEN_FOOTWEAR_EU_SIZES = [
  39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46,
  46.5, 47,
];
const MEN_FOOTWEAR_UK_SIZES = [
  6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14,
];
const MEN_FOOTWEAR_US_SIZES = [
  6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5,
];
const MEN_BELTS_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
const MEN_BELTS_EU_SIZES_INCH = [
  '30-32',
  '32-34',
  '34-36',
  '36-38',
  '38-40',
  '40-42',
  '42-44',
];
const MEN_BELTS_EU_SIZES_CM = [
  '76-81',
  '81-86',
  '86-91',
  '91-106',
  '106-111',
  '111-116',
  '116-121',
];

/* **************************** */
/* **********KIDS DATA********* */
/* **************************** */
const KIDS_FOOTWEAR_EU_SIZES = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
];
const KIDS_FOOTWEAR_UK_SIZES = [
  '5.5-6',
  '6.5-7',
  '7.5-8',
  '8.5-9',
  '9.5-10',
  '10.5-11',
  '11.5-12',
  '12.5-13',
  '13.5-1',
  '1.5-2',
  '2.5-3',
  '3.5-4',
  '4.5-5',
  '5.5-6',
  '6.5-7',
];
const KIDS_FOOTWEAR_US_SIZES = [
  '4.5-5',
  '5.5-6',
  '6.5-7',
  '7.5-8',
  '8.5-9',
  '9.5-10',
  '10.5-11',
  '11.5-12',
  '12.5-13',
  '13.5-1',
  '1.5-2',
  '2.5-3',
  '3.5-4',
  '4.5-5',
  '5.5-6',
];

const SizeCharts = () => {
  const {guide, section} = useLoaderData<typeof loader>();
  const {t} = useTranslation();
  const {setCurrentPage} = useCustomContext();
  const location = useLocation();
  const navigate = useNavigate();
  // const [active, setActive] = useState<{[x: number]: boolean}>({});
  // const [selectedUnit, setSelectedUnit] = useState('CM');

  useEffect(() => {
    setCurrentPage('Size Charts');
  }, []);

  const navigateTo = (guide: string) => {
    const searchParams = new URLSearchParams(location.search);
    const toChangeSection =
      guide === 'kids' && searchParams.get('section') !== 'Footwear';
    if (toChangeSection) {
      searchParams.set('section', 'Footwear');
    }
    searchParams.set('guide', guide);
    navigate(`/sizes?${searchParams.toString()}${location.hash}`);
  };

  return (
    <div className="faqs">
      <div className="py-3 px-4 sm:pb-10 sm:px-8">
        <div className="hidden lg:flex w-fit items-center justify-center mb-8">
          <NavLink to="/" className="text-sm">
            {t('Home')}
          </NavLink>
          <IoIosArrowForward className="m-3" />
          <p className="text-sm">{t('Size Charts')}</p>
        </div>
        <h1 className="text-4xl mb-13">{t('Clothing & Shoes Fit Guide')}</h1>
        <div className="flex items-center justify-between flex-wrap xs:flex-nowrap gap-3.5 sm:gap-28">
          <button
            onClick={() => navigateTo('men')}
            className={`${guide === 'men' ? 'bg-primary-P-40 border-transparent text-white' : 'bg-transparent border-neutral-N-50 text-primary-P-40'} text-center flex-1 border text-sm font-medium rounded-md py-2.5 px-6 transition-colors`}
          >
            {t('Men')}
          </button>
          <button
            onClick={() => navigateTo('women')}
            className={`${guide === 'women' ? 'bg-primary-P-40 border-transparent text-white' : 'bg-transparent border-neutral-N-50 text-primary-P-40'} text-center flex-1 border text-sm font-medium rounded-md py-2.5 px-6 transition-colors`}
          >
            {t('Women')}
          </button>
          <button
            onClick={() => navigateTo('kids')}
            className={`${guide === 'kids' ? 'bg-primary-P-40 border-transparent text-white' : 'bg-transparent border-neutral-N-50 text-primary-P-40'} text-center flex-1 border text-sm font-medium rounded-md py-2.5 px-6 transition-colors`}
          >
            {t('Kids')}
          </button>
        </div>
        {guide ? (
          <div
            className={`mt-8 grid grid-cols-2 ss:grid-cols-2 ${guide !== 'kids' ? 'md:grid-cols-3 xl:grid-cols-4' : 'xl:grid-cols-2'} gap-2 sm:gap-4`}
          >
            <Link
              to={`/sizes?guide=${guide}&section=Footwear#size_details`}
              className={`${section === 'Footwear' ? 'after:bg-black/10' : ''} block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30`}
              style={{backgroundImage: `url('/images/${guide}/shoes.jpg')`}}
            >
              <p className="p-2 text-sm sm:text-base sm:p-4">{t('Footwear')}</p>
            </Link>
            {guide !== 'kids' ? (
              <>
                <Link
                  to={`/sizes?guide=${guide}&section=Clothes#size_details`}
                  className={`${section === 'Clothes' ? 'after:bg-black/10' : ''} block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30`}
                  style={{
                    backgroundImage: `url('/images/${guide}/clothes.jpg')`,
                  }}
                >
                  <p className="p-2 text-sm sm:text-base sm:p-4">
                    {t('Clothes')}
                  </p>
                </Link>
                <Link
                  to={`/sizes?guide=${guide}&section=Bags#size_details`}
                  className={`${section === 'Bags' ? 'after:bg-black/10' : ''} block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30`}
                  style={{backgroundImage: `url('/images/${guide}/bags.jpg')`}}
                >
                  <p className="p-2 text-sm sm:text-base sm:p-4">{t('Bags')}</p>
                </Link>
                <Link
                  to={`/sizes?guide=${guide}&section=Accessories#size_details`}
                  className={`${section === 'Accessories' ? 'after:bg-black/10' : ''} block relative w-full min-h-44 md:min-h-100 border border-neutral-N-80 rounded-xl overflow-hidden bg-white bg-contain bg-center bg-no-repeat after:absolute after:inset-0 after:z-10 after:transition-colors hover:no-underline hover:after:bg-black/10 active:after:bg-black/30`}
                  style={{
                    backgroundImage: `url('/images/${guide}/accessories.jpg')`,
                  }}
                >
                  <p className="p-2 text-sm sm:text-base sm:p-4">
                    {t('Belts & Accessories')}
                  </p>
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {section ? (
          <div id="size_details" className="pt-8 sm:pt-13">
            {/* <div className="flex flex-col gap-5 sm:gap-8 items-start">
              <p className="text-xl sm:text-2xl font-bold">{t(section)}</p>
              <div className="flex rounded-full border border-black overflow-hidden">
                <button
                  onClick={() => setSelectedUnit('In')}
                  className={`${selectedUnit === 'In' ? 'bg-secondary-S-90 text-white' : ''} w-15 transition-colors text-sm font-medium px-3 py-2 rounded-full`}
                >
                  In
                </button>
                <button
                  onClick={() => setSelectedUnit('CM')}
                  className={`${selectedUnit === 'CM' ? 'bg-secondary-S-90 text-white' : ''} w-15 transition-colors text-sm font-medium px-3 py-2 rounded-full`}
                >
                  CM
                </button>
              </div>
            </div> */}
            {guide === 'women' ? (
              section === 'Clothes' ? (
                <ClothesSizes
                  t={t}
                  SIZES={WOMEN_CLOTHES_SIZES}
                  EU_SIZES={WOMEN_CLOTHES_EU_SIZES}
                  UK_SIZES={WOMEN_CLOTHES_UK_SIZES}
                  US_SIZES={WOMEN_CLOTHES_US_SIZES}
                />
              ) : section === 'Footwear' ? (
                <FootwearSizes
                  t={t}
                  EU_SIZES={WOMEN_FOOTWEAR_EU_SIZES}
                  UK_SIZES={WOMEN_FOOTWEAR_UK_SIZES}
                  US_SIZES={WOMEN_FOOTWEAR_US_SIZES}
                />
              ) : section === 'Bags' ? (
                <UnisexBagsSizes t={t} />
              ) : section === 'Accessories' ? (
                <AccessoriesSizes
                  t={t}
                  SIZES={WOMEN_BELTS_SIZES}
                  EU_SIZES={WOMEN_BELTS_EU_SIZES_INCH}
                  UK_SIZES={WOMEN_BELTS_EU_SIZES_CM}
                />
              ) : (
                <p>{t('Invalid Women Section')}</p>
              )
            ) : (
              <></>
            )}
            {guide === 'men' ? (
              section === 'Clothes' ? (
                <MenClothesSizes t={t} />
              ) : section === 'Footwear' ? (
                <FootwearSizes
                  t={t}
                  EU_SIZES={MEN_FOOTWEAR_EU_SIZES}
                  UK_SIZES={MEN_FOOTWEAR_UK_SIZES}
                  US_SIZES={MEN_FOOTWEAR_US_SIZES}
                />
              ) : section === 'Bags' ? (
                <UnisexBagsSizes t={t} />
              ) : section === 'Accessories' ? (
                <AccessoriesSizes
                  t={t}
                  SIZES={MEN_BELTS_SIZES}
                  EU_SIZES={MEN_BELTS_EU_SIZES_INCH}
                  UK_SIZES={MEN_BELTS_EU_SIZES_CM}
                />
              ) : (
                <p>{t('Invalid Men Section')}</p>
              )
            ) : (
              <></>
            )}
            {guide === 'kids' ? (
              section === 'Clothes' ? (
                <h3 className="font-semibold text-2xl xs:text-4xl">
                  {t('COMING SOON...')}
                </h3>
              ) : section === 'Footwear' ? (
                <FootwearSizes
                  t={t}
                  EU_SIZES={KIDS_FOOTWEAR_EU_SIZES}
                  UK_SIZES={KIDS_FOOTWEAR_UK_SIZES}
                  US_SIZES={KIDS_FOOTWEAR_US_SIZES}
                />
              ) : section === 'Bags' ? (
                <h3 className="font-semibold text-2xl xs:text-4xl">
                  {t('COMING SOON...')}
                </h3>
              ) : section === 'Accessories' ? (
                <h3 className="font-semibold text-2xl xs:text-4xl">
                  {t('COMING SOON...')}
                </h3>
              ) : (
                <p>{t('Invalid Kids Section')}</p>
              )
            ) : (
              <></>
            )}

            {/* {section === 'Footwear' || section === 'Clothes' ? (
              <div className="pt-11 sm:pt-36">
                <div className="flex flex-col gap-2">
                  <p className="text-xl sm:text-2xl">{t('How to Measure')}</p>
                  <p className="max-w-115">{t('measure_desc')}</p>
                </div>
                <div className="flex items-center justify-start flex-col sm:flex-row gap-8 max-w-150">
                  <img
                    src={
                      section === 'Clothes'
                        ? '/images/guide.png'
                        : section === 'Footwear'
                          ? '/images/guide-feet.png'
                          : '/no_image.png'
                    }
                    alt="guide"
                    className={`${section === 'Clothes' ? 'w-59' : 'w-100'} order-2 sm:order-1`}
                  />
                  {section === 'Clothes' ? (
                    <div className="order-1 sm:order-2 mt-5 sm:mt-0 flex flex-col items-start gap-4">
                      <div className="flex flex-col gap-4 sm:gap-3">
                        <p className="sm:text-xl">{t('A. Shoulders')}</p>
                        <p>{t('shoulders_desc')}</p>
                      </div>
                      <div className="flex flex-col gap-4 sm:gap-3">
                        <p className="sm:text-xl">{t('B. Chest')}</p>
                        <p>{t('chest_desc')}</p>
                      </div>
                      <div className="flex flex-col gap-4 sm:gap-3">
                        <p className="sm:text-xl">{t('C. Waist')}</p>
                        <p>{t('waist_desc')}</p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:mx-8">
                <p className="text-xl sm:text-2xl">{t("Doesn't Fit?")}</p>
                <p className="max-w-115">{t('fit_desc')}</p>
              </div>
              </div>
            ) : (
              <></>
            )} */}
          </div>
        ) : (
          <></>
        )}
        {/* <div className="flex flex-col gap-5.5 sm:gap-8 mt-8 sm:mt-33">
          <h1 className="text-2xl">{t('Frequently Asked Questions')}</h1>
          <QuestionSection
            questions={questions}
            t={t}
            active={active}
            setActive={setActive}
            limit={5}
          />
        </div> */}
      </div>
    </div>
  );
};

type SizesType = {
  t: TFunction<'translation', undefined>;
  SIZES?: string[];
  EU_SIZES?: (number | string)[];
  UK_SIZES?: (number | string)[];
  US_SIZES?: (number | string)[];
  sectionName?: string;
};

/* **************************************** */
/* ************COMMON SECTIONS************* */
/* **************************************** */
const ClothesSizes = ({
  t,
  SIZES = [],
  EU_SIZES = [],
  UK_SIZES = [],
  US_SIZES = [],
}: SizesType) => {
  return (
    <>
      <p className="sm:text-2xl sm:font-bold mb-5">{t('Clothes')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('Size')}
          </p>
          {SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit px-3 py-1 border border-black text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')}
          </p>
          {EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('UK')}
          </p>
          {UK_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('US')}
          </p>
          {US_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
const FootwearSizes = ({
  t,
  EU_SIZES = [],
  UK_SIZES = [],
  US_SIZES = [],
}: SizesType) => {
  return (
    <>
      <p className="sm:text-2xl sm:font-bold mb-5">{t('Footwear')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')}
          </p>
          {EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('UK')}
          </p>
          {UK_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('US')}
          </p>
          {US_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
const AccessoriesSizes = ({
  t,
  SIZES = [],
  EU_SIZES = [],
  UK_SIZES = [],
}: SizesType) => {
  return (
    <>
      <p className="sm:text-2xl sm:font-bold mb-5">{t('Belts')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('Size')}
          </p>
          {SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit px-3 py-1 border border-black text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')} ({t('IN')})
          </p>
          {EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')} ({t('CM')})
          </p>
          {UK_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 mb-5">
        <p className="sm:text-2xl sm:font-bold">{t('Accessories')}</p>
        <span>
          {t('Hats')} - {t('Beach Accessories')} - {t('Scarfs')} -{' '}
          {t('Sunglasses')} - {t('Wallets')} - {t('Footwear Accessories')}
        </span>
      </div>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('Size')}
          </p>
          <div className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5">
            <p className="w-fit px-3 py-1 whitespace-nowrap text-sm sm:text-base">
              {t("NS")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
const UnisexBagsSizes = ({t}: SizesType) => {
  const EU_SIZES = ['S', 'M', 'L'];
  return (
    <>
      <p className="sm:text-2xl sm:font-bold mb-5">{t('Bags')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')}
          </p>
          {EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* **************************************** */
/* *************MEN SECTIONS*************** */
/* **************************************** */
const MenClothesSizes = ({t}: SizesType) => {
  const CLOTHES_SIZES = [
    'S',
    'S',
    'M',
    'M',
    'L',
    'L',
    'XL',
    '2XL',
    '3XL',
    '4XL',
  ];
  const CLOTHES_EU_SIZES = [44, 46, 48, 50, 52, 54, 56, 58, 60, 62];
  const CLOTHES_UK_SIZES = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52];
  const CLOTHES_US_SIZES = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52];
  const JACKETS_EU_SIZES = [52, 54, 56, 58, 60, 62, 64, 66, 68, 70];
  const JACKETS_UK_SIZES = [42, 44, 46, 48, 50, 52, 54, 56, 58, 60];
  const JACKETS_US_SIZES = [42, 44, 46, 48, 50, 52, 54, 56, 58, 60];

  return (
    <>
      <p className="sm:text-2xl sm:font-bold mb-5">{t('Clothes')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('Size')}
          </p>
          {CLOTHES_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit px-3 py-1 border border-black text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')}
          </p>
          {CLOTHES_EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('UK')}
          </p>
          {CLOTHES_UK_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('US')}
          </p>
          {CLOTHES_US_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="sm:text-2xl sm:font-bold mt-8 mb-5">{t('Jackets')}</p>
      <div className="w-full overflow-auto scrollbar-thin">
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('EU')}
          </p>
          {JACKETS_EU_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('UK')}
          </p>
          {JACKETS_UK_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-stretch justify-start">
          <p className="py-4 sm:py-6 min-w-20 sm:min-w-28 text-xs sm:text-sm font-bold border border-black/5 flex items-center justify-center">
            {t('US')}
          </p>
          {JACKETS_US_SIZES.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-1 bg-[#F0F0F0] min-w-28 sm:min-w-40 max-w-28 sm:max-w-40 py-4 sm:py-6 border border-black/5"
            >
              <p className="w-fit font-bold px-3 py-1 whitespace-nowrap text-sm sm:text-base">
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

type SizesSectionType = {
  withBG: boolean;
  size: string | number;
};
const Size = ({withBG, size}: SizesSectionType) => {
  return (
    <div
      className={`${withBG ? 'bg-[#F0F0F0]' : ''} flex items-center justify-center flex-1 min-w-53 max-w-53 py-7.5 px-13 border border-black/5`}
    >
      <p className="w-fit font-bold px-3 py-1.5 whitespace-nowrap">{size}</p>
    </div>
  );
};

export default SizeCharts;
