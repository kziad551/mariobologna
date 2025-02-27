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
    setCurrentPage('Online Returns');
  }, []);

  return (
    <div className="returns">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">{t('Online Returns Policy')}</h1>
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
              <Link to="#conditions" className="text-sm px-4 py-2">
                {t('General Conditions Applicable to Returns')}
              </Link>
              <Link to="#returns_process" className="text-sm px-4 py-2">
                {t('Returns Process')}
              </Link>
              <Link to="#refund_process" className="text-sm px-4 py-2">
                {t('Refund Process')}
              </Link>
              <Link to="#item_return_policies" className="text-sm px-4 py-2">
                {t('Item Return Policies')}
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
                  <Link to="#conditions" className="text-sm px-4 py-2">
                    {t('General Conditions Applicable to Returns')}
                  </Link>
                  <Link to="#returns_process" className="text-sm px-4 py-2">
                    {t('Returns Process')}
                  </Link>
                  <Link to="#refund_process" className="text-sm px-4 py-2">
                    {t('Refund Process')}
                  </Link>
                  <Link
                    to="#item_return_policies"
                    className="text-sm px-4 py-2"
                  >
                    {t('Item Return Policies')}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div id="conditions" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('General Conditions Applicable to Returns')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('returns_desc_one')}</p>
                <p className="text-justify">{t('returns_desc_two')}</p>
                <ul className="list-disc list-inside">
                  <li className="text-justify">{t('returns_item_one')}</li>
                  <li className="text-justify">{t('returns_item_two')}</li>
                  <li className="text-justify">{t('returns_item_three')}</li>
                  <li className="text-justify">{t('returns_item_four')}</li>
                </ul>
              </div>
            </div>

            <div id="returns_process" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Returns Process')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('returns_process_desc')}</p>
                <ol className="list-decimal list-inside">
                  <li className="text-justify">{t('returns_process_item')}</li>
                </ol>
              </div>
            </div>
            <div id="refund_process" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Refund Process')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="text-justify">{t('refund_process_desc')}</p>
                <p className="text-justify">
                  {t(
                    'Your refund will be processed via the following methods:',
                  )}
                </p>
                <ol className="list-decimal list-inside">
                  <li className="text-justify">
                    {t('refund_process_item_one')}
                  </li>
                  <li className="text-justify">
                    {t('refund_process_item_two')}
                  </li>
                  <li className="text-justify">
                    {t('refund_process_item_three')}
                  </li>
                  <li className="text-justify">
                    {t('refund_process_item_four')}
                  </li>
                </ol>
              </div>
            </div>
            <div id="item_return_policies" className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {t('Item Return Policies')}
              </h2>
              <div className="flex flex-col text-sm sm:text-base gap-4">
                <p className="font-semibold">
                  {t('Damaged Goods and Incorrectly-Fulfilled Orders')}
                </p>
                <p className="text-justify">
                  {t('item_return_policies_desc_one')}
                </p>
                <p className="font-semibold">{t('Shoes')}</p>
                <p className="text-justify">
                  {t('item_return_policies_desc_two')}
                </p>
                <p className="font-semibold">{t('Non-Returnable Items')}</p>
                <p className="text-justify">
                  {t('item_return_policies_desc_three')}
                </p>
                <p className="font-semibold">{t('Packaging')}</p>
                <p className="text-justify">
                  {t('item_return_policies_desc_four')}
                </p>
                <p className="font-semibold">{t('Gifted Items')}</p>
                <p className="text-justify">
                  {t('item_return_policies_desc_five')}
                </p>
              </div>
            </div>
            <div className="flex flex-col text-sm sm:text-base gap-4">
              <p className="text-justify">
                {t('returns_desc_three')}{' '}
                <Link
                  className="hover:underline"
                  to="mailto:customercare@mariobologna.net"
                  target="_blank"
                >
                  customercare@mariobologna.net
                </Link>
                .
              </p>
              <p className="text-justify">{t('returns_desc_four')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
