const VALIDATION_ERROR = 'ValidationError';
const ERROR_CODES = {
  11000: 'Duplicate value detected',
};

export const errorHandler = (err, req, res, next) => {
  console.warn(err);
  if (err.name === VALIDATION_ERROR) {
    return res.status(400).json({ error: err.message });
  }

  if (String(err.code) in ERROR_CODES) {
    return res.status(400).json({ error: ERROR_CODES[String(err.code)] });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};
