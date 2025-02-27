import React, {useEffect, useState} from 'react';
import Countdown from 'react-countdown';
import {useTranslation} from 'react-i18next';

const COUNTDOWN_KEY = 'countdownTargetDate';

const SaleBanner = () => {
  const {t} = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [targetDate, setTargetDate] = useState<number | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem('saleCompleted');
    const savedDate = localStorage.getItem(COUNTDOWN_KEY);

    if (savedDate && !completed) {
      // Use the stored date
      setTargetDate(new Date(savedDate).getTime());
      const expiryDate = new Date(savedDate).getTime(); // Parse ISO string correctly

      const fetchUaeDate = () => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dubai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const date = new Date(formatter.format(new Date()));
        return date;
      };

      const now = fetchUaeDate().getTime();

      if (now < expiryDate) {
        setShowBanner(true); // Show the banner if still within the 3-day window
      } else {
        setShowBanner(false); // Hide the banner if the 3-day window has passed
      }
    } else if (!savedDate && !completed) {
      // Calculate midnight of 2nd December in UAE time
      const targetDate = new Date(Date.UTC(2024, 11, 1, 20, 0, 0, 0)); // 20:00 UTC = 00:00 UAE
      localStorage.setItem(COUNTDOWN_KEY, targetDate.toISOString());
      setTargetDate(targetDate.getTime());
      setTargetDate(targetDate.getTime());
    }
  }, []);

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    setShowBanner(!completed);
    if (completed) {
      localStorage.removeItem(COUNTDOWN_KEY);
      localStorage.setItem('saleCompleted', 'true');
      return <></>;
    } else {
      return (
        <span>
          {days}days {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  if (!showBanner) return null; // Don't render anything if the banner shouldn't be shown

  return (
    <div className="z-[60] sticky top-0 bg-secondary-S-40 w-full text-center text-white text-xs ss:text-sm p-2">
      <p>
        {t(
          'Use the discount code: MARIO and enjoy 25% off your purchase. Offer valid for 3 days only!',
        )}{' '}
        <span className="font-bold text-nowrap">
          {targetDate ? (
            <Countdown date={targetDate} renderer={renderer} />
          ) : (
            <></>
          )}
        </span>
      </p>
    </div>
  );
};

export default SaleBanner;
