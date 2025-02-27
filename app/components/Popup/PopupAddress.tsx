import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PopupContainer from './PopupContainer';
import {CgClose} from 'react-icons/cg';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import AddressFormInputs from '../AddressFormInputs';
import {Checkbox} from 'primereact/checkbox';
import {TFunction} from 'i18next';

export type AddressFormProps = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  email: string;
  title: string;
  addressForm: {[x: string]: string};
  setAddressForm: React.Dispatch<React.SetStateAction<{[x: string]: string}>>;
  loadingSubmit: boolean;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    addressId: string,
  ) => void;
  initialDefaultAddress: boolean;
  isDefaultAddress: boolean;
  setIsDefaultAddress: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const PopupAddressForm = forwardRef(
  (
    {
      t,
      direction,
      title,
      addressForm,
      setAddressForm,
      email,
      handleSubmit,
      loadingSubmit,
      initialDefaultAddress = false,
      isDefaultAddress = false,
      setIsDefaultAddress,
      errorMessage,
      setErrorMessage,
    }: AddressFormProps,
    ref: React.ForwardedRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>,
  ) => {
    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
      const close = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenPopup(false);
          setAddressForm({});
          setErrorMessage('');
        }
      };

      window.addEventListener('keyup', close);

      return () => {
        window.removeEventListener('keyup', close);
      };
    }, []);

    useEffect(() => {
      setErrorMessage('');
    }, [addressForm]);

    useEffect(() => {
      if (!openPopup) {
        setErrorMessage('');
        setAddressForm({});
      }
    }, [openPopup]);

    useImperativeHandle(ref, () => {
      return {
        openTrigger: () => setOpenPopup(true),
        closeTrigger: () => setOpenPopup(false),
      };
    });

    return (
      <PopupContainer openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <div className="p-4 md:px-8 md:py-16.25 w-full md:w-181.75 rounded bg-[#F5F5F5]">
          <div className="flex items-center justify-between mb-2 md:mb-8 gap-1">
            <p className="text-4xl">{title}</p>
            <CgClose
              className="h-5 w-5 cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                setOpenPopup(false);
                setAddressForm({});
                setErrorMessage('');
              }}
            />
          </div>
          <form
            onSubmit={(e) => handleSubmit(e, addressForm.addressId)}
            className="max-w-133.5 flex flex-col items-stretch gap-8"
          >
            <div className={direction === 'rtl' ? 'rtl-container' : ''}>
              <FloatLabel>
                <InputText
                  disabled
                  readOnly
                  type="email"
                  value={email ?? ''}
                  className="bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
                />
                <label className="ml-2 -mt-2" htmlFor="email">
                  {t('Email address')}
                </label>
              </FloatLabel>
            </div>
            <AddressFormInputs
              t={t}
              direction={direction}
              addressForm={addressForm}
              setAddressForm={setAddressForm}
            />
            <div className="flex align-items-center gap-2">
              {initialDefaultAddress ? (
                <label className="text-sm text-neutral-N-80 font-medium">
                  {t('Already is the default address')}
                </label>
              ) : (
                <>
                  <Checkbox
                    inputId="default_address"
                    name="default_address"
                    value="yes"
                    onChange={(e) => setIsDefaultAddress(e.checked ?? false)}
                    checked={isDefaultAddress}
                    className="bg-transparent"
                  />
                  <label htmlFor="default_address">
                    {t('Set as default address')}
                  </label>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="submit"
                value={!loadingSubmit ? t('Save') : t('Saving')}
                disabled={loadingSubmit}
                className={`${loadingSubmit ? 'opacity-50' : ''} py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
              />
              {errorMessage !== '' ? (
                <p className="text-red-600">{errorMessage}</p>
              ) : (
                <></>
              )}
            </div>
          </form>
        </div>
      </PopupContainer>
    );
  },
);

export default PopupAddressForm;
