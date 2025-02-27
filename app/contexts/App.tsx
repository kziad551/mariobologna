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
      const geolocation = await getUserGeoLocation();
      const storedCurrency = localStorage.getItem('currency');
      
      if (storedCurrency) {
        const c = JSON.parse(storedCurrency) as currencyType;
        // Check if stored currency matches current location
        if (c.countryCode === geolocation.country_code) {
          setCurrency(c);
          Cookies.set('country', JSON.stringify(c.countryCode), {path: '/'});
          return;
        }
      }
      
      // If no stored currency or location mismatch, set based on current location
      let curr = allCurrencies.find(
        (c) => c.countryCode === geolocation.country_code,
      );
      if (curr === undefined) {
        if (geolocation.continent_code === 'EU') {
          curr = allCurrencies.find((c) => c.countryCode === 'FR') ?? allCurrencies[0];
        } else {
          curr = allCurrencies.find((c) => c.countryCode === 'US') ?? allCurrencies[0];
        }
      }
      
      setCurrency(curr);
      Cookies.set('country', JSON.stringify(curr.countryCode), {path: '/'});
      localStorage.setItem('currency', JSON.stringify(curr));
    }
  };

  useEffect(() => {
    fetchUserCountry();
    
    // Check for location changes every hour
    const intervalId = setInterval(fetchUserCountry, 3600000);
    
    return () => clearInterval(intervalId);
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
