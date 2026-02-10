export function sanitizeKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const newObj = {};
  for (const key in obj) {
    const safeKey = key.replace(/\$/g, '_').replace(/\./g, '_');
    newObj[safeKey] = sanitizeKeys(obj[key]);
  }
  return newObj;
}
