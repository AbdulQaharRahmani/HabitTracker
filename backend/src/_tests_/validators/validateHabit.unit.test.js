import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validate } from '../../middleware/validate.js';

vi.mock('express-validator', async () => {
  const chain = {
    notEmpty: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
    isString: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
    trim: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    isMongoId: vi.fn().mockReturnThis(),
    isISO8601: vi.fn().mockReturnThis(),
  };

  return {
    body: vi.fn(() => chain),
    query: vi.fn(() => chain),
    param: vi.fn(() => chain),
    validationResult: vi.fn(),
  };
});

vi.mock('../../utils/error.js', () => {
  const AppError = vi.fn(function (message, status = 400) {
    this.message = message;
    this.status = status;
    this.name = 'AppError';
  });

  AppError.prototype = Object.create(Error.prototype);
  AppError.prototype.constructor = AppError;

  return { AppError };
});

describe('createHabitValidator – UNIT (mocked express-validator)', () => {
  let validationResult;
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();

    const ev = await import('express-validator');
    validationResult = ev.validationResult;

    handler = validate;
  });

  it('1. No validation errors → calls next()', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('2. One validation error → throws AppError', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Title is required' }],
    });

    expect(() => handler(req, res, next)).toThrow();

    expect(next).not.toHaveBeenCalled();
  });

  it('3. Multiple errors → uses first error message', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Title is required' }, { msg: 'Frequency invalid' }],
    });

    try {
      handler(req, res, next);
    } catch (err) {
      expect(err.message).toBe('Title is required');
      expect(err.status).toBe(400);
    }
  });

  it('4. Malformed error object → still throws AppError', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{}],
    });

    expect(() => handler(req, res, next)).toThrow();
  });

  it('5. validationResult crashes → error bubbles up', () => {
    const req = {};
    const res = {};
    const next = vi.fn();

    validationResult.mockImplementation(() => {
      throw new Error('validator failure');
    });

    expect(() => handler(req, res, next)).toThrow('validator failure');
  });
});
