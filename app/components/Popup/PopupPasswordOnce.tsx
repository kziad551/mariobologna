import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PopupContainer from './PopupContainer';
import {CgClose} from 'react-icons/cg';
import {TFunction} from 'i18next';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {AnimatePresence, motion} from 'framer-motion';
import {IoMdCheckboxOutline} from 'react-icons/io';
import {FaCopy} from 'react-icons/fa';

export type LocateStoreProps = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  password: string;
};

const PopupPasswordOnce = forwardRef(
  (
    {t, direction, password}: LocateStoreProps,
    ref: React.ForwardedRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>,
  ) => {
    const {width} = useWindowDimensions();
    const [openPopup, setOpenPopup] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        openTrigger: () => setOpenPopup(true),
        closeTrigger: () => setOpenPopup(false),
      };
    });

    const handleCopyPassword = () => {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <PopupContainer
        innerContainerStyle="!overflow-visible"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        outsideClickable={false}
      >
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-white border-neutral-N-80 p-4 max-w-md">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-lg">{t('Your Password')}</h3>
            <button
              className="rounded-lg z-10 bg-white p-2 hover:bg-neutral-N-92/80"
              onClick={() => setOpenPopup(false)}
              aria-label="Close"
            >
              <CgClose className="ss:h-6 ss:w-6 w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 p-3 bg-gray-100 rounded-lg">
              <span className="font-mono text-lg font-bold">{password}</span>
              <button
                onClick={handleCopyPassword}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                aria-label="Copy password"
              >
                <FaCopy className="w-5 h-5" />
              </button>
            </div>
            
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 flex items-center justify-center gap-1 text-green-600"
                >
                  <IoMdCheckboxOutline className="w-5 h-5" /> 
                  {t('Password copied to clipboard')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <p className="text-center text-gray-600 text-sm">
            {t('Please copy this password to use it later on when logging in again with email/password')}
          </p>
        </div>
      </PopupContainer>
    );
  },
);

export default PopupPasswordOnce;
