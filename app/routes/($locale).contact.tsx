import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, MetaFunction, useLoaderData} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BiPhone} from 'react-icons/bi';
import {IoIosArrowForward, IoIosTimer} from 'react-icons/io';
import {LuMail, LuMapPin} from 'react-icons/lu';
import {useCustomContext} from '~/contexts/App';
import GoogleMapComponent from '~/components/GoogleMap';

const containerStyle = {
  width: '100%',
  height: '516px',
};

const center = {
  lat: 25.18574266146552,
  lng: 55.27583851928053,
};

export const meta: MetaFunction = () => {
  return [
    {title: 'Contact Mario Bologna - Luxury Fashion Brand in Dubai'},
    {description: 'Get in touch with Mario Bologna, the premier luxury fashion brand in Dubai. Contact us for customer service, store locations, and business inquiries.'},
    {keywords: 'Mario Bologna contact, luxury fashion Dubai, customer service, store location, business inquiries, fashion brand contact'},
    {robots: 'index, follow'},
    {og: {
      title: 'Contact Mario Bologna - Luxury Fashion Brand in Dubai',
      description: 'Connect with Mario Bologna for premium fashion services in Dubai',
      type: 'website',
      url: 'https://mariobologna.net/contact'
    }},
    {twitter: {
      card: 'summary_large_image',
      title: 'Contact Mario Bologna - Luxury Fashion Brand in Dubai',
      description: 'Connect with Mario Bologna for premium fashion services in Dubai'
    }}
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {env} = context;

  return defer({GOOGLE_API_KEY: env.GOOGLE_API_KEY});
}

const ContactUs = () => {
  const {GOOGLE_API_KEY} = useLoaderData<typeof loader>();
  const {setCurrentPage, direction} = useCustomContext();
  const {t} = useTranslation();
  useEffect(() => {
    setCurrentPage('Contact Us');
  }, []);

  return (
    <div className="contact">
      {/* SEO Content - Hidden but accessible to search engines */}
      <div className="hidden">
        <h1>Contact Mario Bologna - Luxury Fashion Brand in Dubai</h1>
        <h2>Connect With Our Premium Fashion Services</h2>
        <h3>Customer Service & Support</h3>
        <p>Experience exceptional customer service at Mario Bologna. Our dedicated team is available during UAE working hours to assist you with all your fashion needs.</p>
        
        <h3>Store Location & Directions</h3>
        <p>Visit our flagship store in Dubai at Office 303, Metropolis Tower, Business Bay. Easily accessible and centrally located in the heart of Dubai's business district.</p>
        
        <h4>Business Hours</h4>
        <p>Our store is open during UAE working hours from 9AM to 6PM, providing you with convenient access to our luxury fashion collections.</p>
        
        <h4>Contact Information</h4>
        <p>Reach out to us via email at customercare@mariobologna.net or call us at +971 4 666 7601 for immediate assistance.</p>
        
        <h5>Related Links</h5>
        <ul>
          <li><Link to="/about">About Mario Bologna</Link></li>
          <li><Link to="/collections">Our Collections</Link></li>
          <li><Link to="/stores">Store Locations</Link></li>
        </ul>
      </div>

      <div className="py-3 px-4 sm:py-36 sm:px-8 flex flex-col items-stretch justify-start gap-8 sm:gap-18">
        <h1 className="text-5xl font-medium hidden sm:block">
          {t('Contact Us')}
        </h1>
        <div className="flex justify-start flex-col md:flex-row items-start gap-8 sm:gap-18">
          <div className="flex flex-col gap-5.5 sm:gap-10 sm:max-w-100">
            <div className="flex items-start justify-start gap-2 flex-col sm:flex-row sm:gap-4">
              <LuMail className="min-w-6 min-h-6 sm:min-w-8 sm:min-h-8" />
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="sm:text-xl">{t('Email')}</p>
                <Link
                  to="mailto:customercare@mariobologna.net"
                  target="_blank"
                  className="text-sm sm:text-base"
                >
                  customercare@mariobologna.net
                </Link>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2 flex-col sm:flex-row sm:gap-4">
              <BiPhone className="min-w-6 min-h-6 sm:min-w-8 sm:min-h-8" />
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="sm:text-xl">{t('Phone')}</p>
                <Link
                  to="tel:+971 4 666 7601"
                  target="_blank"
                  className="text-sm sm:text-base"
                >
                  +971 4 666 7601
                </Link>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2 flex-col sm:flex-row sm:gap-4">
              <IoIosTimer className="min-w-6 min-h-6 sm:min-w-8 sm:min-h-8" />
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="sm:text-xl">{t('Times')}</p>
                <Link
                  to="tel:+971 4 666 7601"
                  target="_blank"
                  className="text-sm sm:text-base"
                >
                  {t('During UAE working hours from 9AM to 6PM')}
                </Link>
              </div>
            </div>
            <div className="flex items-start justify-start gap-2 flex-col sm:flex-row sm:gap-4">
              <LuMapPin className="min-w-6 min-h-6 sm:min-w-8 sm:min-h-8" />
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="sm:text-xl">{t('Office')}</p>
                <p className="text-sm sm:text-base">{t('office_value')}</p>
                <Link
                  to={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-primary-P-40 mt-4 py-2.5 sm:pl-3 pr-4 flex items-center justify-center gap-2"
                >
                  <span className="text-sm font-medium">
                    {t('Get Directions')}
                  </span>
                  <IoIosArrowForward
                    className={`${direction === 'rtl' ? 'rotate-180' : ''} w-4.5 h-4.5`}
                  />
                </Link>
              </div>
            </div>
          </div>
          <GoogleMapComponent
            t={t}
            center={center}
            containerStyle={containerStyle}
            positions={[
              {
                position: center,
                name: 'Office 303, Metropolis Tower, Business Bay, Dubai UAE',
              },
            ]}
            zoom={25}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
