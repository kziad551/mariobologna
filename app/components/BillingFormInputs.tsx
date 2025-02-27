import {TFunction} from 'i18next';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';

import React from 'react';
import {FaApple} from 'react-icons/fa';
import {FcGoogle} from 'react-icons/fc';
import {Dropdown} from 'primereact/dropdown';

type BillingFormInputsType = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  newBillingForm: {[x: string]: string};
  setNewBillingForm: React.Dispatch<
    React.SetStateAction<{[x: string]: string}>
  >;
};

const BillingFormInputs = ({
  t,
  direction,
  newBillingForm,
  setNewBillingForm,
}: BillingFormInputsType) => {
  const methods: any[] = [
    {
      value: 'Google',
      name: t('Google'),
    },
    {
      value: 'Apple',
      name: t('Apple'),
    },
  ];

  return (
    <>
      <IconField
        className={`${direction === 'rtl' ? 'rtl-container' : ''} relative`}
        iconPosition={direction === 'rtl' ? 'right' : 'left'}
      >
        <InputIcon>
          <img src="/icons/payment_methods.svg" />
        </InputIcon>
        <FloatLabel>
          <Dropdown
            required
            id="methods"
            name="methods"
            placeholder={t('Select a Method')}
            value={newBillingForm['methods'] ?? ''}
            onChange={(e) =>
              setNewBillingForm((prevSelected) => ({
                ...prevSelected,
                ['methods']: e.target.value,
              }))
            }
            options={methods}
            optionLabel="name"
            className="!bg-transparent w-full px-2 py-4 xs:p-4 rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label
            className={`${direction === 'rtl' ? 'mr-8 xs:mr-10' : 'ml-8 xs:ml-10'} -mt-2`}
            htmlFor="email"
          >
            {t('Payment Methods')}
          </label>
        </FloatLabel>
        <div
          className={`${direction === 'rtl' ? 'left-8 xs:left-10' : 'right-8 xs:right-10'} absolute top-1/2 -translate-y-1/2 flex gap-2 items-center justify-center`}
        >
          <FaApple />
          <FcGoogle />
        </div>
      </IconField>
      <div className="flex items-center justify-center gap-7">
        <div className="flex-1 h-0.25 bg-neutral-N-80"></div>
        <p>{t('Or')}</p>
        <div className="flex-1 h-0.25 bg-neutral-N-80"></div>
      </div>
      <div className={`${direction === 'rtl' ? 'rtl-container' : ''} relative`}>
        <FloatLabel>
          <InputText
            required
            id="card_number"
            type="number"
            value={newBillingForm['card_number'] ?? ''}
            onChange={(e) =>
              setNewBillingForm((prevSelected) => ({
                ...prevSelected,
                ['card_number']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="card_number">
            {t('Card Number')}
          </label>
        </FloatLabel>
        <div
          className={`${direction === 'rtl' ? 'left-4' : 'right-4'} absolute top-1/2 -translate-y-1/2 flex gap-3 items-center justify-center`}
        >
          <img src="/icons/amex.svg" />
          <img src="/icons/Maestro.svg" />
          <img src="/icons/Mastercard.svg" />
        </div>
      </div>
      <div
        className={`${direction === 'rtl' ? 'rtl-container' : ''} flex flex-wrap xs:flex-nowrap items-start gap-4`}
      >
        <FloatLabel>
          <InputText
            required
            id="date"
            type="text"
            value={newBillingForm['date'] ?? ''}
            onChange={(e) =>
              setNewBillingForm((prevSelected) => ({
                ...prevSelected,
                ['date']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="date">
            {t('Expiration date (MM/YY)')}
          </label>
        </FloatLabel>
        <FloatLabel>
          <InputText
            required
            id="security_code"
            type="text"
            value={newBillingForm['security_code'] ?? ''}
            onChange={(e) =>
              setNewBillingForm((prevSelected) => ({
                ...prevSelected,
                ['security_code']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="security_code">
            {t('Security Code')}
          </label>
        </FloatLabel>
      </div>
      <div className={direction === 'rtl' ? 'rtl-container' : ''}>
        <FloatLabel>
          <InputText
            required
            id="card_name"
            type="text"
            value={newBillingForm['card_name'] ?? ''}
            onChange={(e) =>
              setNewBillingForm((prevSelected) => ({
                ...prevSelected,
                ['card_name']: e.target.value,
              }))
            }
            className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
          />
          <label className="ml-2 -mt-2" htmlFor="card_name">
            {t('Name on Card')}
          </label>
        </FloatLabel>
      </div>
    </>
  );
};

export default BillingFormInputs;
