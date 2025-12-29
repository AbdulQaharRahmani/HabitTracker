export class DateHelper {
  /** Return startOfToday and endOfToday date as array*/
  static getStartAndEndOfToday() {
    let today = new Date();
    let startOfToday = new Date(today.setHours(0, 0, 0, 0));
    let endOfToday = new Date(today.setHours(23, 59, 59, 999));

    return [startOfToday, endOfToday];
  }
}
