import type { RateStatus } from '../types/index';

const POLAND_TZ = 'Europe/Warsaw';
// NBP publikuje kursy w dni robocze zazwyczaj ok. 11:45-12:00
const PUBLICATION_HOUR = 12;

export function getPolandDateTime(): Date {
  const now = new Date();
  const polandStr = now.toLocaleString('en-US', { timeZone: POLAND_TZ });
  return new Date(polandStr);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getRateStatus(): RateStatus {
  const polandNow = getPolandDateTime();
  const hours = polandNow.getHours();
  const minutes = polandNow.getMinutes();
  const businessDay = !isWeekend(polandNow);
  const isAfterPublication =
    hours > PUBLICATION_HOUR ||
    (hours === PUBLICATION_HOUR && minutes >= 0);

  const polandTime = polandNow.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: POLAND_TZ,
  });

  const polandDate = polandNow.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: POLAND_TZ,
  });

  let message: string;
  let statusType: RateStatus['statusType'];

  if (!businessDay) {
    const dayName = polandNow.toLocaleDateString('pl-PL', {
      weekday: 'long',
      timeZone: POLAND_TZ,
    });
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    message = `${capitalized} — wyświetlane kursy z ostatniego dnia roboczego`;
    statusType = 'weekend';
  } else if (!isAfterPublication) {
    message = `Przed publikacją NBP (ok. 12:00) — kursy z poprzedniego dnia roboczego`;
    statusType = 'pending';
  } else {
    message = `Kursy aktualne na bieżący dzień roboczy`;
    statusType = 'fresh';
  }

  return {
    isBusinessDay: businessDay,
    isAfterPublication,
    polandTime,
    polandDate,
    message,
    statusType,
  };
}

export function formatEffectiveDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
