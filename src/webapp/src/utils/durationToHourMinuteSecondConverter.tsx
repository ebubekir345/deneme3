import { useTranslation } from 'react-i18next';
import iff from './iff';

export default function durationToHourMinuteSecondConverter(t, durationInSeconds: number, isLongFormat?: boolean) {
  let durInSec = durationInSeconds;
  const days = Math.floor(durInSec / 86400);
  durInSec %= 86400;
  const hours = Math.floor(durInSec / 3600);
  durInSec %= 3600;
  const minutes = Math.floor(durInSec / 60);
  const seconds = Math.floor(durInSec % 60);

  return `${
    days
      ? `${days} ${t(
          `General.${days === 1 ? iff(isLongFormat, 'DayLong', 'Day') : iff(isLongFormat, 'DaysLong', 'Days')}`
        )} `
      : ``
  }${
    hours
      ? `${hours} ${t(
          `General.${hours === 1 ? iff(isLongFormat, 'HourLong', 'Hour') : iff(isLongFormat, 'HoursLong', 'Hours')}`
        )} `
      : ``
  }${
    minutes
      ? `${minutes} ${t(
          `General.${
            minutes === 1 ? iff(isLongFormat, 'MinuteLong', 'Minute') : iff(isLongFormat, 'MinutesLong', 'Minutes')
          }`
        )} `
      : ``
  }${
    seconds
      ? `${seconds} ${t(
          `General.${
            seconds === 1 ? iff(isLongFormat, 'SecondLong', 'Second') : iff(isLongFormat, 'SecondsLong', 'Seconds')
          }`
        )}`
      : ``
  }`;
}
