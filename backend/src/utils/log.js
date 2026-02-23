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
// export const sanitizeSensitiveData = (value) => {
//   if (Array.isArray(value)) return value.map(sanitizeSensitiveData);

//   if (!value || typeof value !== 'object') return value;

//   const obj = {};
//   for (const [k, v] of Object.entries(value)) {
//     obj[k] = SENSITIVE_KEYS.has(k) ? '[REDACTED]' : sanitizeSensitiveData(v);
//   }

//   return obj;
// };

// export const sanitizeSensitiveData = (
//   value,
//   options = { maxDepth: 6, maxItems: 50 }
// ) => {
//   const seen = new WeakSet();

//   const sanitize = (current, depth) => {
//     if (current === null || current === undefined) return current;
//     if (typeof current !== 'object') return current;

//     if (depth >= options.maxDepth) return '[TRUNCATED_DEPTH]';

//     if (seen.has(current)) return '[CIRCULAR]';
//     seen.add(current);

//     if (Array.isArray(current)) {
//       const limited = current.slice(0, options.maxItems);
//       const sanitized = limited.map((item) => sanitize(item, depth + 1));
//       if (current.length > options.maxItems) {
//         sanitized.push(
//           `[TRUNCATED_ITEMS:${current.length - options.maxItems}]`
//         );
//       }
//       return sanitized;
//     }

//     const entries = Object.entries(current);
//     const limitedEntries = entries.slice(0, options.maxItems);
//     const obj = {};

//     for (const [k, v] of limitedEntries) {
//       obj[k] = SENSITIVE_KEYS.has(k) ? '[REDACTED]' : sanitize(v, depth + 1);
//     }

//     if (entries.length > options.maxItems) {
//       obj.__truncatedKeys = entries.length - options.maxItems;
//     }

//     return obj;
//   };

//   return sanitize(value, 0);
// };

export function sanitizeSensitiveData(data, maxDepth = 6, maxItems = 50) {
  const seen = new WeakSet(); // WeakSet is like Set but better for memory

  function clean(value, depth = 0) {
    if (value === null || typeof value !== 'object') return value;
    if (depth >= maxDepth) return '[TRUNCATED_DEPTH]';
    if (seen.has(value)) return '[CIRCULAR]';

    seen.add(value);

    if (Array.isArray(value)) {
      const result = [];

      for (let i = 0; i < Math.min(value.length, maxItems); i++) {
        result.push(clean(value[i], depth + 1));
      }

      if (value.length > maxItems) {
        result.push(`[TRUNCATED_ITEMS:${value.length - maxItems}]`);
      }

      return result;
    }

    const result = {};
    const keys = Object.keys(value);

    for (let i = 0; i < Math.min(keys.length, maxItems); i++) {
      const key = keys[i];

      if (SENSITIVE_KEYS.has(key)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = clean(value[key], depth + 1);
      }
    }

    if (keys.length > maxItems) {
      result.__truncatedKeys = keys.length - maxItems;
    }

    return result;
  }

  return clean(data);
}
