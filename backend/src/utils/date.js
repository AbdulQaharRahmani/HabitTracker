import dayjs from 'dayjs';
import { ERROR_CODES } from './constant.js';
import { AppError } from './error.js';

export class DateHelper {
  /** Return startOfToday and endOfToday date as array*/
  static getStartAndEndOfToday() {
    let today = new Date();
    let startOfToday = new Date(today.setHours(0, 0, 0, 0));
    let endOfToday = new Date(today.setHours(23, 59, 59, 999));

    return [startOfToday, endOfToday];
  }

  static getStartOfDate(date) {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
      throw new AppError(
        'Invalid Date',
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'date'
      );
    }
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static getEndOfDate(date) {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
      throw new AppError(
        'Invalid Date',
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'date'
      );
    }
    d.setHours(23, 59, 59, 999);
    return d;
  }

  static getStartAndEndOfWeek(date, startDay) {
    const baseDate = dayjs(date).startOf('day'); //today
    const currentDay = baseDate.day();

    // distance to start of week
    const diff = (currentDay - startDay + 7) % 7;

    const start = baseDate.subtract(diff, 'day').startOf('day');
    const end = start.add(6, 'day').endOf('day');

    return [start, end];
  }

  static TIMEZONES = {
    kabul: 'Asia/Kabul',
    tehran: 'Asia/Tehran',
    karachi: 'Asia/Karachi',
    kolkata: 'Asia/Kolkata',
    dubai: 'Asia/Dubai',
    istanbul: 'Europe/Istanbul',
    riyadh: 'Asia/Riyadh',
    utc: 'UTC',
    newyork: 'America/New_York',
    chicago: 'America/Chicago',
    denver: 'America/Denver',
    london: 'Europe/London',
    paris: 'Europe/Paris',
    berlin: 'Europe/Berlin',
    moscow: 'Europe/Moscow',
    tashkent: 'Asia/Tashkent',
    bishkek: 'Asia/Bishkek',
    dushanbe: 'Asia/Dushanbe',
  };
}
