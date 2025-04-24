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
    setCurrentPage('Privacy & Cookies');
  }, []);

  return (
    <div className="privacy">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">
            {t('Privacy & Cookies Policy')}
          </h1>
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
              <Link to="#information" className="text-sm px-4 py-2">
                {t('Information We May Collect')}
              </Link>
              <Link to="#cookies" className="text-sm px-4 py-2">
                {t('Cookies')}
              </Link>
              <Link to="#information_usage" className="text-sm px-4 py-2">
                {t('How We Use Information')}
              </Link>
              <Link to="#information_share" className="text-sm px-4 py-2">
                {t('Who We May Share Information With')}
              </Link>
              <Link to="#contact_us" className="text-sm px-4 py-2">
                {t('Contacting Us and Opting Out')}
              </Link>
              <Link to="#protection" className="text-sm px-4 py-2">
                {t('Protecting Your Data')}
              </Link>
              <Link to="#third_party" className="text-sm px-4 py-2">
                {t('Third-Party Websites')}
              </Link>
              <Link to="#dubai_police" className="text-sm px-4 py-2">
                {t('Dubai Police e-Crime')}
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
                  <Link
                    onClick={() => setActive(!active)}
                    to="#information"
                    className="text-sm px-4 py-2"
                  >
                    {t('Information We May Collect')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#cookies"
                    className="text-sm px-4 py-2"
                  >
                    {t('Cookies')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#information_usage"
                    className="text-sm px-4 py-2"
                  >
                    {t('How We Use Information')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#information_share"
                    className="text-sm px-4 py-2"
                  >
                    {t('Who We May Share Information With')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#contact_us"
                    className="text-sm px-4 py-2"
                  >
                    {t('Contacting Us and Opting Out')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#protection"
                    className="text-sm px-4 py-2"
                  >
                    {t('Protecting Your Data')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#third_party"
                    className="text-sm px-4 py-2"
                  >
                    {t('Third-Party Websites')}
                  </Link>
                  <Link
                    onClick={() => setActive(!active)}
                    to="#dubai_police"
                    className="text-sm px-4 py-2"
                  >
                    {t('Dubai Police e-Crime')}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('privacy_desc_one')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('privacy_desc_two')}}
              ></p>
            </div>
            <div id="information" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Information We May Collect')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('information_desc_one')}</p>
                <ul className="list-disc list-inside">
                  <li className="text-justify">
                    {t('information_list_item_one')}
                  </li>
                  <li className="text-justify">
                    {t('information_list_item_two')}
                  </li>
                  <li className="text-justify">
                    {t('information_list_item_three')}
                  </li>
                  <li className="text-justify">
                    {t('information_list_item_four')}
                  </li>
                </ul>
                <p className="text-justify">{t('information_desc_two')}</p>
                <p className="text-justify">{t('information_desc_three')}</p>
              </div>
            </div>
            <div id="cookies" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Cookies')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('cookies_desc_one')}</p>
                <p className="text-justify">
                  {t('There are five types of cookies:')}
                </p>
                <p className="font-semibold text-lg">
                  {t('Website Functionality Cookies')}
                </p>
                <p className="text-justify">
                  {t('website_functionality_desc')}
                </p>
                <p className="font-semibold text-lg">
                  {t('Website Analytics Cookies')}
                </p>
                <p className="text-justify">{t('website_analytics_desc')}</p>
                <p className="font-semibold text-lg">
                  {t('Customer Preference Cookies')}
                </p>
                <p className="text-justify">{t('customer_preference_desc')}</p>
                <p className="font-semibold text-lg">
                  {t('Targeting or Advertising Cookies')}
                </p>
                <p className="text-justify">
                  {t('targeting_advertising_desc')}
                </p>
                <p className="font-semibold text-lg">
                  {t('Third-Party Service Provider Cookies')}
                </p>
                <p className="text-justify">{t('service_provider_desc_one')}</p>
                <p className="font-semibold text-justify">
                  {t('service_provider_desc_two')}
                </p>
                <p className="text-justify">
                  {t('service_provider_desc_three')}
                </p>
              </div>
            </div>
            <div id="information_usage" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('How We Use Information')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('use_information_desc')}</p>
                <ul className="list-disc list-inside">
                  <li className="text-justify">
                    {t('use_information_item_one')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_two')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_three')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_four')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_five')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_six')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_seven')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_eight')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_nine')}
                  </li>
                  <li className="text-justify">
                    {t('use_information_item_ten')}
                  </li>
                </ul>
              </div>
            </div>
            <div id="information_share" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Who We May Share Information With')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('information_share_desc')}</p>
                <ul className="list-disc list-inside">
                  <li className="text-justify">
                    {t('information_share_item_one')}
                  </li>
                  <li className="text-justify">
                    {t('information_share_item_two')}
                  </li>
                  <li className="text-justify">
                    {t('information_share_item_three')}
                  </li>
                  <li className="text-justify">
                    {t('information_share_item_four')}
                  </li>
                  <li className="text-justify">
                    {t('information_share_item_five')}
                  </li>
                  <li className="text-justify">
                    {t('information_share_item_six')}
                  </li>
                </ul>
              </div>
            </div>
            <div id="contact_us" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Contacting Us and Opting Out')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">
                  {t('contact_desc_one')}{' '}
                  <Link
                    className="hover:underline"
                    to="mailto:customercare@mariobologna.net"
                    target="_blank"
                  >
                    customercare@mariobologna.net
                  </Link>
                  .
                </p>
                <p className="text-justify">{t('contact_desc_two')}</p>
                <p className="text-justify">{t('contact_desc_three')}</p>
              </div>
            </div>
            <div id="protection" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Protecting Your Data')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('protection_desc_one')}</p>
                <p className="text-justify">{t('protection_desc_two')}</p>
              </div>
            </div>
            <div id="third_party" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Third-Party Websites')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('third_party_websites_desc')}</p>
              </div>
            </div>
            <div id="dubai_police" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Dubai Police e-Crime')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('dubai_police_desc_one')}</p>
                <p className="text-justify">{t('dubai_police_desc_two')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
