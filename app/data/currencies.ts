import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export type currencyType = {
  currency: {[key: string]: string};
  countryCode3: {[key: string]: string};
  countryCode: CountryCode;
  country: string;
  exchange_rate: number;
  img: string;
};

export const allCurrencies: currencyType[] = [
  {
    currency: {en: 'AED', ar: 'درهم'},
    countryCode3: {en: 'UAE', ar: 'الإمارات'},
    img: '/countries/AED.svg',
    countryCode: 'AE',
    country: 'Emirates',
    exchange_rate: 1.0,
  },
  {
    currency: {en: 'SAR', ar: 'ريال سعودي'},
    countryCode3: {en: 'SAU', ar: 'سعودية'},
    img: '/countries/SAR.svg',
    countryCode: 'SA',
    country: 'Saudi Arabia',
    exchange_rate: 1.02,
  },
  {
    currency: {en: 'OMR', ar: 'ريال عماني'},
    countryCode3: {en: 'OMN', ar: 'عمان'},
    img: '/countries/OMR.svg',
    countryCode: 'OM',
    country: 'Oman',
    exchange_rate: 0.1,
  },
  {
    currency: {en: 'KWD', ar: 'دينار كويتي'},
    countryCode3: {en: 'KWT', ar: 'الكويت'},
    img: '/countries/KWD.svg',
    countryCode: 'KW',
    country: 'Kuwait',
    exchange_rate: 0.083,
  },
  {
    currency: {en: 'USD', ar: 'دولار أمريكي'},
    countryCode3: {en: 'USA', ar: ' أمريكا'},
    img: '/countries/USD.svg',
    countryCode: 'US',
    country: 'United States',
    exchange_rate: 0.27,
  },
  {
    currency: {en: 'EUR', ar: 'يورو'},
    countryCode3: {en: 'EUU', ar: 'أوروبا'},
    img: '/countries/EUR.svg',
    countryCode: 'FR',
    country: 'Europe',
    exchange_rate: 0.25,
  },
  {
    currency: {en: 'GBP', ar: 'جنيه استرليني'},
    countryCode3: {en: 'GBR', ar: 'بريطانيا'},
    img: '/countries/GBP.svg',
    countryCode: 'GB',
    country: 'Britain',
    exchange_rate: 0.21,
  },
  {
    currency: {en: 'QAR', ar: 'ريال قطري'},
    countryCode3: {en: 'QAR', ar: 'قطر'},
    img: '/countries/QAR.svg',
    countryCode: 'QA',
    country: 'Qatar',
    exchange_rate: 0.99,
  },
  {
    currency: {en: 'BHD', ar: 'دينار بحريني'},
    countryCode3: {en: 'BHR', ar: 'بحرين'},
    img: '/countries/BHD.svg',
    countryCode: 'BH',
    country: 'Bahrain',
    exchange_rate: 0.1,
  },
  // {
  //   currency: {en: 'LBP', ar: 'ليرة لبنانية'},
  //   img: '/countries/LBP.svg',
  //   countryCode: 'LB',
  //   country: 'Lebanon',
  //   exchange_rate: 24301.06,
  // },
];
