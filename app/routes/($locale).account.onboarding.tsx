import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useNavigate, type MetaFunction} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {tokenCookie, verifyToken} from '~/utils/auth';
import {MdClose} from 'react-icons/md';
import {useCustomContext} from '~/contexts/App';
import {allCurrencies, currencyType} from '~/data/currencies';
import {useTranslation} from 'react-i18next';
import {toggleDesigner} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

export const meta: MetaFunction = () => {
  return [{title: 'Onboarding'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookieHeader = request.headers.get('Cookie');

  const token = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return redirect('/account/login');
  }

  const customerID = await verifyToken(token, storefront);
  if (!customerID) {
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  return defer({});
}

const OnBoarding = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {setShowHeaderFooter, showBoardingPage, language, setLanguage} =
    useCustomContext();
  const {header} = useRootLoaderData();
  const {menu} = header;
  const [isLoading, setIsLoading] = useState(true);

  const [allDesigners, setAllDesigners] = useState<any | null>(null);
  const [selectedDesigners, setSelectedDesigners] = useState<
    {[key: string]: string}[]
  >([]);
  const [selectedCurrency, setSelectedCurrency] = useState<currencyType>({
    currency: {en: 'AED', ar: 'درهم'},
    countryCode3: {en: 'UAE', ar: 'الإمارات'},
    img: '/countries/AED.svg',
    countryCode: 'AE',
    country: 'Emirates',
    exchange_rate: 1.0,
  });

  useEffect(() => {
    if (menu) {
      const designers =
        menu.items.find((item) => item.title === 'Designers') ?? null;
      if (designers) {
        const allDesigners =
          designers.items.find((item) => item.title === 'All Designers')
            ?.items ?? null;
        setAllDesigners(allDesigners);
      }
    }
  }, [menu]);

  useEffect(() => {
    if (!showBoardingPage) {
      navigate('/', {replace: true});
    } else {
      setShowHeaderFooter(false);
      setIsLoading(false);
    }
  }, [showBoardingPage]);

  if (isLoading) {
    return <></>; // Render nothing while loading
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('currency', JSON.stringify(selectedCurrency));
    localStorage.setItem('designers', JSON.stringify(selectedDesigners));

    navigate('/account', {replace: true});
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-stretch justify-start">
      <div className="sticky top-0 flex-1 w-full h-screen">
        <img
          src="/images/onboarding_img.jpeg"
          alt="onboarding"
          className="h-screen object-cover"
        />
      </div>
      <div className="flex-1 min-h-screen pt-14 pb-19 pl-12 pr-8 flex flex-col items-stretch justify-start">
        <div className="flex items-start justify-between gap-4 mb-20">
          <div className="flex flex-col gap-2.5">
            <img src="/logo.svg" alt="logo" className="w-87" />
            <h1 className="text-3xl">{t('House of Brands')}</h1>
          </div>
          <Link
            to="/account"
            replace={true}
            className="px-3 py-2.5 text-primary-P-40 text-sm font-medium"
          >
            {t('Skip')}
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="w-3/4">
          <div className="flex flex-col gap-7.75">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-medium">{t('Language')}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <button
                  type="button"
                  className={`${
                    language === 'en'
                      ? 'bg-primary-P-40 text-white border-transparent'
                      : 'bg-transparent text-primary-P-40 border-primary-P-40'
                  } px-6 py-2.5 border rounded text-sm font-medium transition-all`}
                  onClick={() => setLanguage('en')}
                >
                  {t('English')}
                </button>
                <button
                  type="button"
                  className={`${
                    language === 'ar'
                      ? 'bg-primary-P-40 text-white border-transparent'
                      : 'bg-transparent text-primary-P-40 border-primary-P-40'
                  } px-6 py-2.5 border rounded text-sm font-medium transition-all`}
                  onClick={() => setLanguage('ar')}
                >
                  العربية
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-medium">{t('Currency')}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {allCurrencies.map((currency) => (
                  <button
                    type="button"
                    key={currency.currency[language]}
                    className={`${
                      selectedCurrency.currency[language] ===
                      currency.currency[language]
                        ? 'bg-primary-P-40 text-white border-transparent'
                        : 'bg-transparent text-primary-P-40 border-primary-P-40'
                    } flex items-center gap-2 px-6 py-2.5 border rounded text-sm font-medium transition-all`}
                    onClick={() => setSelectedCurrency(currency)}
                  >
                    <img
                      src={currency.img}
                      alt="currency logo"
                      className="w-5.75"
                    />
                    <span>{currency.currency[language]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-medium">
                {t("Designers You're Interested In")}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {allDesigners.map((designer: any) => (
                  <button
                    type="button"
                    key={designer.title}
                    className={`${
                      selectedDesigners.includes(designer.title)
                        ? 'bg-primary-P-40 text-white border-transparent'
                        : 'bg-transparent text-primary-P-40 border-primary-P-40'
                    } px-6 py-2.5 border rounded-lg text-sm font-medium transition-all`}
                    onClick={() =>
                      toggleDesigner(setSelectedDesigners, designer.title)
                    }
                  >
                    <span className="flex items-center gap-2">
                      {t(designer.title)}
                      <MdClose
                        className={`${selectedDesigners.includes(designer.title) ? 'block' : 'hidden'} w-4.5 h-4.5`}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <input
              type="submit"
              value={t('Submit')}
              className="bg-primary-P-40 text-white mt-auto px-6 py-2.5 text-sm font-medium rounded-md"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnBoarding;
