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
}
