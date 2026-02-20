export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_CREDENTIAL: 'INVALID_CREDENTIAL',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_JWT: 'INVALID_JWT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  DUPLICATE: 'DUPLICATE',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NO_FIELDS_PROVIDED: 'NO_FIELDS_PROVIDED',
  RESOURCE_IN_USED: 'RESOURCE_IN_USED',
  FORBIDDEN: 'FORBIDDEN',
  RESOURCE_ALREADY_REMOVED: 'RESOURCE_ALREADY_REMOVED',
  ALREADY_COMPLETED: 'ALREADY_COMPLETED',
  UPLOAD_IMAGE: 'UPLOAD_IMAGE',
  PASSWORD_SAME_AS_OLD: 'PASSWORD_SAME_AS_OLD',
  END_DATE_BEFORE_START_DATE: 'END_DATE_BEFORE_START_DATE',
  INVALID_DATE_FORMAT: 'INVALID_DATE_FORMAT',
  DATE_OUT_OF_RANGE: 'DATE_OUT_OF_RANGE',
  INVALID_ID: 'INVALID_ID',
};

export const DAY_MAP = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'cookie',
  'refreshToken',
  'accessToken',
]);

export const toLogSummary = (log) => ({
  logId: log.logId,
  timestamp: log.timestamp,
  level: log.level,
  method: log.method,
  path: log.path,
  statusCode: log.statusCode,
  userId: log.userId ?? null,
  duration: log.duration,
  clientIp: log.clientIp,
  userAgent: log.userAgent,
});
