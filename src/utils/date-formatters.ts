import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Converts ISO date string (YYYY-MM-DD) to Russian format (DD.MM.YYYY)
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns Formatted date in DD.MM.YYYY format
 */
export function formatDateRU(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return format(date, 'dd.MM.yyyy', { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate;
  }
}

/**
 * Converts Russian date format (DD.MM.YYYY) to ISO format (YYYY-MM-DD)
 * @param ruDate - Date string in DD.MM.YYYY format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function parseRUDate(ruDate: string): string {
  try {
    const date = parse(ruDate, 'dd.MM.yyyy', new Date());
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing date:', error);
    return '';
  }
}

/**
 * Gets current date in ISO format (YYYY-MM-DD)
 */
export function getCurrentDateISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Formats date to long Russian format (8 декабря 2024)
 */
export function formatDateLongRU(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return format(date, 'd MMMM yyyy', { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate;
  }
}

/**
 * Checks if date is today
 */
export function isToday(isoDate: string): boolean {
  return isoDate === getCurrentDateISO();
}

/**
 * Checks if date is in the past
 */
export function isPast(isoDate: string): boolean {
  return isoDate < getCurrentDateISO();
}

/**
 * Checks if date is in the future
 */
export function isFuture(isoDate: string): boolean {
  return isoDate > getCurrentDateISO();
}

/**
 * Gets the first day of the month for a given date
 */
export function getFirstDayOfMonth(isoDate: string): string {
  const date = new Date(isoDate);
  return format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
}

/**
 * Adds days to a date
 */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return format(date, 'yyyy-MM-dd');
}

/**
 * Subtracts days from a date
 */
export function subtractDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() - days);
  return format(date, 'yyyy-MM-dd');
}

/**
 * Gets the day number of the month (1-31)
 */
export function getDayOfMonth(isoDate: string): number {
  return new Date(isoDate).getDate();
}
