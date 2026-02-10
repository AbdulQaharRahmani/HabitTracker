import { DateHelper } from '../utils/date.js';
import { getDatesBetween, getTop, readLogsByDate } from '../utils/log.js';

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

  // Filtering section
  if (req.query.level) {
    logs = logs.filter((log) => log.level === req.query.level);
  }

  if (req.query.method) {
    logs = logs.filter((log) => log.method === req.query.method);
  }

  if (req.query.sort) {
    if (req.query.sort === 'newest') {
      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    if (req.query.sort === 'oldest') {
      logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  }

  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    logs = logs.filter((log) => log.path.toLowerCase().includes(searchTerm));
  }

  // pagination
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const startIndex = (page - 1) * limit;
  const lastIndex = startIndex + limit;

  const paginatedLogs = logs.slice(startIndex, lastIndex);

  res.status(200).json({
    success: true,
    count: logs.length,
    totalPages: Math.ceil(logs.length / limit),
    currentPage: page,
    data: paginatedLogs,
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

  const topRoutes = getTop(logs, 'path', 5);
  const topDevices = getTop(logs, 'userAgent', 5);

  res.status(200).json({
    success: true,
    data: { stats, topRoutes, topDevices },
  });
};
