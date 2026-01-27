import { DateHelper } from '../utils/date.js';
import { getDatesBetween, readLogsByDate } from '../utils/log.js';

export const getLogs = async (req, res) => {
  const [startDate, endDate] = DateHelper.getStartAndEndOfDate(
    req.query.startDate,
    req.query.endDate
  );

  // return array of all dates between start and end
  const dates = getDatesBetween(startDate, endDate);

  let logs = [];

  for (const date of dates) {
    logs.push(...readLogsByDate(date));
  }

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
};

export const getLogStats = async (req, res) => {
  const [startDate, endDate] = DateHelper.getStartAndEndOfDate(
    req.query.startDate,
    req.query.endDate
  );

  const dates = getDatesBetween(startDate, endDate);

  let logs = [];

  for (const date of dates) {
    logs.push(...readLogsByDate(date));
  }

  const stats = {
    total: logs.length,
    error: logs.filter((l) => l.level === 'error').length,
    warn: logs.filter((l) => l.level === 'warn').length,
    info: logs.filter((l) => l.level === 'info').length,
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
};
