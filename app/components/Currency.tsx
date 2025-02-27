import React, {useMemo} from 'react';
import {Dropdown, DropdownProps} from 'primereact/dropdown';
import {allCurrencies, currencyType} from '~/data/currencies';
import {useCustomContext} from '~/contexts/App';
import {CartForm} from '@shopify/hydrogen';
import Cookies from 'js-cookie';

const CurrencyDropdown = ({showLabel = true}: {showLabel?: boolean}) => {
  const {language, currency, setCurrency} = useCustomContext();

  // Sort currencies alphabetically based on the selected language
  const sortedCurrencies = useMemo(() => {
    return allCurrencies.sort((a, b) =>
      a.countryCode3[language].localeCompare(b.countryCode3[language]),
    );
  }, [language]);

  const selectedCurrencyTemplate = (
    option: currencyType,
    props: DropdownProps,
  ) => {
    if (option) {
      return (
        <div className="flex items-center gap-2">
          <img
            alt={option.countryCode3[language]}
            src={option.img}
            className="w-5 h-6"
          />
          {showLabel ? <p>{option.countryCode3[language]}</p> : <></>}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const currencyOptionTemplate = (option: currencyType) => {
    return (
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.BuyerIdentityUpdate}
        inputs={{
          buyerIdentity: {countryCode: option.countryCode},
        }}
      >
        <button type="submit" className="flex items-center gap-2">
          <img
            alt={option.countryCode3[language]}
            src={option.img}
            className="w-5 h-6"
          />
          {showLabel ? <p>{option.countryCode3[language]}</p> : <></>}
        </button>
      </CartForm>
    );
  };

  return (
    <Dropdown
      id="currency"
      value={currency}
      onChange={(e) => {
        localStorage.setItem('currency', JSON.stringify(e.value));
        Cookies.set('currency', JSON.stringify(e.value), {path: '/'});
        setCurrency(e.value);
      }}
      options={sortedCurrencies}
      optionLabel={`currency.${language}`}
      valueTemplate={selectedCurrencyTemplate}
      itemTemplate={currencyOptionTemplate}
      className={`${showLabel ? "px-3" : "px-1 xs:px-3"} flex items-center gap-2 py-2.5 !border-none !shadow-none !bg-transparent hover:!bg-neutral-N-92 active:!bg-neutral-N-87 transition-all rounded-md`}
    />
  );
};

export default CurrencyDropdown;
