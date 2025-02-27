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

    return (
      <PopupContainer
        innerContainerStyle="!overflow-visible"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        outsideClickable={false}
      >
        <div className="flex items-center justify-center gap-5 rounded-xl border bg-white border-neutral-N-80 p-2">
          <button
            className="rounded-lg z-10 bg-white p-2 hover:bg-neutral-N-92/80"
            onClick={() => setOpenPopup(false)}
          >
            <CgClose className="ss:h-6 ss:w-6 w-5 h-5" />
          </button>
          <div className="w-full flex flex-col">
            <div className="flex gap-1">
              <span>{t('Password')}:</span>
              <div className="relative">
                <input
                  type="button"
                  className="relative font-bold text-blue-500 hover:text-blue-500/80 transition-colors cursor-pointer active:text-blue-500/60"
                  onClick={(e: any) => {
                    setIsCopied(true);
                    navigator.clipboard.writeText(e.target.value);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  value={password}
                />
                <AnimatePresence>
                  {isCopied && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                        transition: {
                          duration: 0.5,
                          ease: 'easeInOut',
                        },
                      }}
                      exit={{
                        opacity: 0,
                        transition: {
                          duration: 0.2,
                          ease: 'easeInOut',
                        },
                      }}
                      className="absolute bottom-full -translate-y-1/3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 rounded bg-green-500 px-2 py-1 text-white text-nowrap"
                    >
                      <IoMdCheckboxOutline className="w-5 h-5" /> {t('Copied')}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full border-r-[12px] border-t-[12px] border-l-[12px] border-l-transparent border-r-transparent border-t-green-500"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <span className="text-primary-P-80 font-semibold italic text-xs sm:text-sm leading-none">
              {t(
                'Please copy this password to use it later on when logging in again with email/password',
              )}
            </span>
          </div>
        </div>
      </PopupContainer>
    );
  },
);

export default PopupPasswordOnce;
