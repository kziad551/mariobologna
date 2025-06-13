import {AnimatePresence, motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {useCustomContext} from '~/contexts/App';
import {IoIosArrowDown} from 'react-icons/io';
import {useTranslation} from 'react-i18next';
import {Link, Meta} from '@remix-run/react';

export const meta = () => {
  return [
    {title: 'Shipping & Delivery Policy | Mario Bologna'},
    {name: 'description', content: 'Learn about Mario Bologna\'s shipping and delivery policies, including order delivery, pre-order information, and tracking details. Fast and reliable shipping worldwide.'},
    {name: 'keywords', content: 'Mario Bologna shipping, delivery policy, order tracking, pre-order delivery, international shipping'},
    {property: 'og:title', content: 'Shipping & Delivery Policy | Mario Bologna'},
    {property: 'og:description', content: 'Learn about Mario Bologna\'s shipping and delivery policies, including order delivery, pre-order information, and tracking details.'},
    {property: 'og:type', content: 'website'},
  ];
};

const Privacy = () => {
  const {setCurrentPage} = useCustomContext();
  const [active, setActive] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('Shipping & Delivery');
  }, []);

  return (
    <>
      <div className="sr-only" aria-hidden="true">
        <h1>Mario Bologna Shipping and Delivery Information</h1>
        <h2>International Shipping Services</h2>
        <p>Mario Bologna offers premium shipping services worldwide. Our delivery network ensures your fashion items reach you safely and on time.</p>
        
        <h2>Shipping Options and Delivery Times</h2>
        <p>Choose from our range of shipping options including standard and express delivery. Track your order in real-time from dispatch to delivery.</p>
        
        <h2>Pre-Order Shipping Information</h2>
        <p>Pre-order items are shipped as soon as they become available. Stay updated with our pre-order shipping notifications.</p>
        
        <h2>Shipping Policies and Guidelines</h2>
        <ul>
          <li>Worldwide Shipping Available</li>
          <li>Secure Package Handling</li>
          <li>Real-time Order Tracking</li>
          <li>Flexible Delivery Options</li>
          <li>International Shipping Support</li>
        </ul>
        
        <h2>Customer Support for Shipping</h2>
        <p>Need help with your order? Contact our customer service team:</p>
        <ul>
          <li>Email: <a href="mailto:customercare@mariobologna.net">customercare@mariobologna.net</a></li>
          <li>Shipping Inquiries: <a href="/contact">Contact Us</a></li>
          <li>Order Tracking: <a href="/track-order">Track Your Order</a></li>
        </ul>
        
        <h2>Shipping FAQ</h2>
        <p>Find answers to common shipping questions about Mario Bologna's delivery services, international shipping, and order tracking.</p>
      </div>

      <div className="delivery">
        <div className="py-3 px-4 sm:py-36 sm:px-8">
          <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
            <h1 className="text-5xl font-medium">{t('Shipping & Delivery')}</h1>
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
                <Link to="#order_delivery" className="text-sm px-4 py-2">
                  {t('Order Delivery')}
                </Link>
                <Link to="#pre_order_delivery" className="text-sm px-4 py-2">
                  {t('Pre-Order Delivery')}
                </Link>
                <Link to="#general_delivery" className="text-sm px-4 py-2">
                  {t('General Delivery Conditions')}
                </Link>
                <Link to="#changes_tracking" className="text-sm px-4 py-2">
                  {t('Address Changes & Tracking')}
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
                    <Link to="#order_delivery" className="text-sm px-4 py-2">
                      {t('Order Delivery')}
                    </Link>
                    <Link to="#pre_order_delivery" className="text-sm px-4 py-2">
                      {t('Pre-Order Delivery')}
                    </Link>
                    <Link to="#general_delivery" className="text-sm px-4 py-2">
                      {t('General Delivery Conditions')}
                    </Link>
                    <Link to="#changes_tracking" className="text-sm px-4 py-2">
                      {t('Address Changes & Tracking')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
              <div id="order_delivery" className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {t('Order Delivery')}
                </h2>
                <div className="flex flex-col text-sm sm:text-base gap-4">
                  <p className="text-justify">{t('order_delivery_desc_one')}</p>
                  <p className="text-justify">{t('order_delivery_desc_two')}</p>
                  <p className="text-justify">{t('order_delivery_desc_three')}</p>
                </div>
              </div>
              <div id="pre_order_delivery" className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {t('Pre-Order Delivery')}
                </h2>
                <div className="flex flex-col text-sm sm:text-base gap-4">
                  <p className="text-justify">{t('pre_order_delivery_desc')}</p>
                </div>
              </div>
              <div id="general_delivery" className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {t('General Delivery Conditions')}
                </h2>
                <div className="flex flex-col text-sm sm:text-base gap-4">
                  <p className="text-justify">{t('general_delivery_desc_one')}</p>
                  <p className="text-justify">{t('general_delivery_desc_two')}</p>
                </div>
              </div>
              <div id="changes_tracking" className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {t('Address Changes & Tracking')}
                </h2>
                <div className="flex flex-col text-sm sm:text-base gap-4">
                  <p className="text-justify">{t('changes_tracking_desc_one')}</p>
                  <p className="text-justify">
                    {t('changes_tracking_desc_two')}{' '}
                    <Link
                      className="hover:underline"
                      to="mailto:customercare@mariobologna.net"
                      target="_blank"
                    >
                      customercare@mariobologna.net
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
