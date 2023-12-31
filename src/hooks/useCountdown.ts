import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

type UseCountdown = (endTime: number) => {
  timeLeft: TimeLeft;
  leftTimeInSeconds: number;
};

export const useCountdown: UseCountdown = (endTime: number) => {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [momentum, setMomentum] = useState<number>(0);

  const formatDateUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const endTimeMoment = moment.unix(endTime);
  const timeDifference = moment.duration(
    endTimeMoment.diff(moment.unix(currentTime + momentum)),
  );

  useEffect(() => {
    setCurrentTime(moment().unix());

    intervalIdRef.current = setInterval(() => {
      setMomentum((prevMomentum) => prevMomentum + 1);
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    timeDifference.asSeconds() < 0 && clearInterval(intervalIdRef.current);
  }, [timeDifference]);

  const isExpired = timeDifference.asSeconds() < 0;

  return {
    timeLeft: {
      days: isExpired ? '00' : formatDateUnit(timeDifference.days()),
      hours: isExpired ? '00' : formatDateUnit(timeDifference.hours()),
      minutes: isExpired ? '00' : formatDateUnit(timeDifference.minutes()),
      seconds: isExpired ? '00' : formatDateUnit(timeDifference.seconds()),
    },
    leftTimeInSeconds: isExpired ? 0 : timeDifference.asSeconds(),
  };
};
