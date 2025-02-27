import {t} from 'i18next';
import Cookies from 'js-cookie';
import React, {ReactNode, useEffect, useRef} from 'react';
import PopupPasswordOnce from '~/components/Popup/PopupPasswordOnce';
import {allCurrencies, currencyType} from '~/data/currencies';
import {getUserGeoLocation} from '~/lib/utils';
import i18n from '~/utils/i18n';

interface InitStateType {}

export const initialState: InitStateType = {};

interface contextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  showHeaderFooter: boolean;
  setShowHeaderFooter: React.Dispatch<React.SetStateAction<boolean>>;
  showBoardingPage: boolean;
  setShowBoardingPage: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  currency: currencyType;
  setCurrency: React.Dispatch<React.SetStateAction<currencyType>>;
  direction: 'ltr' | 'rtl';
  ref: React.MutableRefObject<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>;
  passwordOnce: string;
  setPasswordOnce: React.Dispatch<React.SetStateAction<string>>;
}

const Context = React.createContext<contextType>({
  loading: true,
  setLoading: () => {},
  currentPage: '',
  setCurrentPage: () => {},
  showHeaderFooter: true,
  setShowHeaderFooter: () => {},
  showBoardingPage: true,
  setShowBoardingPage: () => {},
  language: 'en',
  setLanguage: () => {},
  currency: allCurrencies[0],
  setCurrency: () => {},
  direction: 'ltr',
  ref: {
    current: {
      openTrigger: () => {},
      closeTrigger: () => {},
    },
  },
  passwordOnce: '',
  setPasswordOnce: () => {},
});

export function useCustomContext() {
  return React.useContext(Context);
}

export default function ContextProvider({children}: {children: ReactNode}) {
  const ref = useRef<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>({
    openTrigger: () => {},
    closeTrigger: () => {},
  });

  const [passwordOnce, setPasswordOnce] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState('');
  const [showHeaderFooter, setShowHeaderFooter] = React.useState(true);
  const [showBoardingPage, setShowBoardingPage] = React.useState(false);
  const [language, setLanguage] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });
  const [direction, setDirection] = React.useState<'ltr' | 'rtl' | null>(null);
  const [currency, setCurrency] = React.useState<currencyType>(
    allCurrencies[0],
  );

  const fetchUserCountry = async () => {
    if (typeof window !== 'undefined') {
      const currency = localStorage.getItem('currency');
      if (currency) {
        const c = JSON.parse(currency) as currencyType;
        setCurrency(c);
        Cookies.set('country', JSON.stringify(c.countryCode), {path: '/'});
      } else {
        const geolocation = await getUserGeoLocation();
        let curr = allCurrencies.find(
          (c) => c.countryCode === geolocation.country_code,
        );
        if (curr === undefined) {
          if (geolocation.continent_code === 'EU') {
            const c =
              allCurrencies.find((c) => c.countryCode === 'FR') ??
              allCurrencies[0];
            setCurrency(c);
            Cookies.set('country', JSON.stringify(c.countryCode), {path: '/'});
            localStorage.setItem('currency', JSON.stringify(c));
          } else {
            const c =
              allCurrencies.find((c) => c.countryCode === 'US') ??
              allCurrencies[0];
            setCurrency(c);
            Cookies.set('country', JSON.stringify(c.countryCode), {path: '/'});
            localStorage.setItem('currency', JSON.stringify(c));
          }
        } else {
          setCurrency(curr);
          Cookies.set('country', JSON.stringify(curr.countryCode), {path: '/'});
          localStorage.setItem('currency', JSON.stringify(curr));
        }
      }
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      setDirection(language === 'ar' ? 'rtl' : 'ltr');
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        currentPage,
        setCurrentPage,
        showHeaderFooter,
        setShowHeaderFooter,
        showBoardingPage,
        setShowBoardingPage,
        language,
        setLanguage,
        currency,
        setCurrency,
        direction: direction ?? 'ltr',
        ref,
        passwordOnce,
        setPasswordOnce,
      }}
    >
      <div dir={direction ?? 'ltr'}>
        {children}
        <PopupPasswordOnce
          ref={ref}
          password={passwordOnce}
          direction={direction ?? 'ltr'}
          t={t}
        />
      </div>
    </Context.Provider>
  );
}
