import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { SENSITIVE_KEYS } from './constant.js';

const logsDir = path.join(process.cwd(), 'logs');

export const getDatesBetween = (start, end) => {
  const dates = [];
  let current = dayjs(start);
  const last = dayjs(end);

  while (current.isBefore(last) || current.isSame(last)) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
};

export const readLogsByDate = (date) => {
  try {
    const files = fs
      .readdirSync(logsDir)
      .filter((file) => file.startsWith(`application-${date}.log`));

    let logs = [];

    // maybe we have more than one log file in one day then we should loop over them
    for (const file of files) {
      const content = fs.readFileSync(path.join(logsDir, file), 'utf-8');
      const lines = content.split('\n').filter(Boolean);

      for (const line of lines) {
        logs.push(JSON.parse(line));
      }
    }

    return logs;
  } catch (err) {
    console.log(err.message);
    return [];
  }
};

export const getTop = (items, key, limit = 5) => {
  const map = {};
  let total = 0;

  for (let item of items) {
    if (!item[key]) continue;
    map[item[key]] = (map[item[key]] || 0) + 1;
    total++;
  }

  return Object.entries(map)
    .map(([name, count]) => ({
      name,
      count,
      percent: ((count / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

//  replaces secrets fields (passwords, tokens,...) with [REDACTED] value, for logs security
export const sanitizeSensitiveData = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeSensitiveData);

  if (!value || typeof value !== 'object') return value;

  const obj = {};
  for (const [k, v] of Object.entries(value)) {
    obj[k] = SENSITIVE_KEYS.has(k) ? '[REDACTED]' : sanitizeSensitiveData(v);
  }

  return obj;
};
