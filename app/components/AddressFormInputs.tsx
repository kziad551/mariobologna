import {TFunction} from 'i18next';
import {Dropdown} from 'primereact/dropdown';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import React from 'react';
import {countries} from '~/data/selectCountries';

type AddressFormInputsType = {
  addressForm: {[x: string]: string};
  setAddressForm: React.Dispatch<React.SetStateAction<{[x: string]: string}>>;
  showEmailInput?: boolean;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
};

const AddressFormInputs = ({
  t,
  direction,
  addressForm,
  setAddressForm,
  showEmailInput = false,
}: AddressFormInputsType) => {
  return (
    <>
      {showEmailInput ? (
        <div className={direction === 'rtl' ? 'rtl-container' : ''}>
          <FloatLabel>
            <InputText
              required
              id="email"
              name="email"
              type="email"
              value={addressForm['email'] ?? ''}
              onChange={(e) =>
                setAddressForm((prevSelected) => ({
                  ...prevSelected,
                  ['email']: e.target.value,
                }))
              }
              className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
            />
            <label className="ml-2 -mt-2" htmlFor="email">
              {t('Email address')}
            </label>
          </FloatLabel>
        </div>
      ) : (
        <></>
      )}
      <div className={direction === 'rtl' ? 'rtl-container' : ''}>
        <FloatLabel>
          <Dropdown
            id="country"
            name="country"
            value={addressForm['country'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['country']: e.target.value,
              }))
            }
            options={countries}
            optionLabel="name"
            placeholder={t('Select a Country')}
            filter
            className="!bg-transparent w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="email">
            {t('Country')}
          </label>
        </FloatLabel>
      </div>
      <div
        className={`${direction === 'rtl' ? 'rtl-container' : ''} flex flex-wrap xs:flex-nowrap items-start gap-4`}
      >
        <FloatLabel>
          <InputText
            required
            id="firstName"
            name="firstName"
            type="text"
            value={addressForm['firstName'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['firstName']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="firstName">
            {t('First Name')}
          </label>
        </FloatLabel>
        <FloatLabel>
          <InputText
            required
            id="lastName"
            name="lastName"
            type="text"
            value={addressForm['lastName'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['lastName']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="lastName">
            {t('Last Name')}
          </label>
        </FloatLabel>
      </div>
      <div className={direction === 'rtl' ? 'rtl-container' : ''}>
        <FloatLabel>
          <InputText
            id="company"
            name="company"
            type="text"
            value={addressForm['company'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['company']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="company">
            {t('Company')}
          </label>
        </FloatLabel>
        <p className="text-xs mt-1 ml-4 text-neutral-N-30">{t('Optional')}</p>
      </div>
      <div className={direction === 'rtl' ? 'rtl-container' : ''}>
        <FloatLabel>
          <InputText
            required
            id="address1"
            name="address1"
            type="text"
            value={addressForm['address1'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['address1']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="address1">
            {t('Address')}
          </label>
        </FloatLabel>
        <p className="text-xs mt-1 ml-4 text-neutral-N-30">
          {t('add apartment, suite, building, street name')}
        </p>
      </div>
      <div
        className={`${direction === 'rtl' ? 'rtl-container' : ''} flex flex-wrap xs:flex-nowrap items-start gap-4`}
      >
        <FloatLabel>
          <InputText
            required
            id="city"
            name="city"
            type="text"
            value={addressForm['city'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['city']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="city">
            {t('City')}
          </label>
        </FloatLabel>
        <div className={`${direction === 'rtl' ? 'rtl-container' : ''} w-full`}>
          <FloatLabel>
            <InputText
              required
              id="zip"
              name="zip"
              type="text"
              value={addressForm['zip'] ?? ''}
              onChange={(e) =>
                setAddressForm((prevSelected) => ({
                  ...prevSelected,
                  ['zip']: e.target.value,
                }))
              }
              className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
            />
            <label className="ml-2 -mt-2" htmlFor="zip">
              {t('Postal Code')}
            </label>
          </FloatLabel>
          <p className="text-xs mt-1 ml-4 text-neutral-N-30">{t('Optional')}</p>
        </div>
      </div>
      <div className={direction === 'rtl' ? 'rtl-container' : ''}>
        <FloatLabel>
          <InputText
            required
            id="phone"
            name="phone"
            type="text"
            value={addressForm['phone'] ?? ''}
            onChange={(e) =>
              setAddressForm((prevSelected) => ({
                ...prevSelected,
                ['phone']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="phone">
            {t('Phone')}
          </label>
        </FloatLabel>
        <p className="text-xs mt-1 ml-4 text-neutral-N-30">
          {t('Get notified about delivery status')}
        </p>
      </div>
    </>
  );
};

export default AddressFormInputs;
