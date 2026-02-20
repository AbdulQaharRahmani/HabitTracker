import path from 'path';
import fs from 'fs';
import { DateHelper } from '../utils/date.js';
import { getDatesBetween, getTop, readLogsByDate } from '../utils/log.js';
import { AppError, notFound } from '../utils/error.js';
import { validate as isUUID } from 'uuid';
import { ERROR_CODES } from '../utils/constant.js';

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

export const getLogById = async (req, res) => {
  const { id } = req.params;
  if (!id || !isUUID(id))
    throw new AppError('Invalid Id', 400, ERROR_CODES.INVALID_ID);

  let result = null;

  const logsDir = path.join(process.cwd(), 'logs');

  const files = fs
    .readdirSync(logsDir)
    .filter((file) => file.startsWith('application-'))
    .sort()
    .reverse();

  for (const file of files) {
    const content = fs.readFileSync(path.join(logsDir, file), 'utf-8');
    const lines = content.split('\n').filter(Boolean);

    for (const line of lines) {
      const log = JSON.parse(line);
      if (log.logId === id) {
        result = log;
        break;
      }
    }

    if (result) break;
  }

  if (!result) throw notFound('log');

  res.status(200).json({
    success: true,
    data: result,
  });
};
