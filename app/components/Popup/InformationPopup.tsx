import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {BiMailSend} from 'react-icons/bi';
import {motion, AnimatePresence} from 'framer-motion';
import {TFunction} from 'i18next';

export type InformationPopupType = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  message: string;
  popupKey: string;
};

const InformationPopup = forwardRef<
  {
    openTrigger: () => void;
    closeTrigger: () => void;
  },
  InformationPopupType
>(({t, direction, message, popupKey}, ref) => {
  const [popup, setPopup] = useState<{[popupKey: string]: boolean}>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (popup[popupKey]) {
      // Clear the previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setPopup({}), 8000);
    }
    // Clean up the timeout when the component unmounts or the effect is rerun
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [popup[popupKey], message]);

  useImperativeHandle(ref, () => {
    return {
      openTrigger: () => setPopup({[popupKey]: true}),
      closeTrigger: () => setPopup({[popupKey]: false}),
    };
  });
  return (
    <AnimatePresence>
      {popup[popupKey] && (
        <motion.div
          initial={{
            opacity: 0,
            x: direction === 'ltr' ? -1000 : 1000,
          }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          }}
          exit={{
            opacity: 0,
            x: direction === 'ltr' ? -1000 : 1000,
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          }}
          className={`${direction === 'ltr' ? 'left-2' : 'right-2'} absolute top-4 z-50 flex items-start justify-center gap-1 rounded bg-[#F5F5F5]/90 px-2 py-1 text-primary-P-40 shadow-xl sm:items-center`}
        >
          <BiMailSend className="min-h-[24px] min-w-[24px] text-xl" />
          <p className="text-sm font-bold">{t(message)}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

InformationPopup.displayName = 'InformationPopup';

export default InformationPopup;
