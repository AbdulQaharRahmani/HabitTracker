import { describe, it, vi, expect, beforeEach } from 'vitest';
import { loginValidate, registerValidate } from '../middleware/validateUser';
import { AppError } from '../utils/error';

vi.mock('express-validator', () => {
  return {
    body: vi.fn(() => ({
      notEmpty: vi.fn().mockReturnThis(),
      withMessage: vi.fn().mockReturnThis(),
      isEmail: vi.fn().mockReturnThis(),
      normalizeEmail: vi.fn().mockReturnThis(),
      isLength: vi.fn().mockReturnThis(),
      isAlphanumeric: vi.fn().mockReturnThis(),
      trim: vi.fn().mockReturnThis(),
    })),
    validationResult: vi.fn(),
  };
});

vi.mock('../utils/error.js', () => {
  const MockAppError = vi.fn(function (message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'AppError';
  });

  MockAppError.prototype = Object.create(Error.prototype);
  MockAppError.prototype.constructor = MockAppError;

  return { AppError: MockAppError };
});

describe('Authentication Middleware Tests', () => {
  let validationResult;

  beforeEach(async () => {
    vi.clearAllMocks();

    const expressValidator = await import('express-validator');
    validationResult = expressValidator.validationResult;
  });

  describe('registerValidate middleware', () => {
    const validateFunction = registerValidate[2];

    it('1. Valid Email and Password -> Pass Validation', async () => {
      const req = {
        body: {
          email: 'valid@test.com',
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      await validateFunction(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('2. Email is missing -> Failed Validation with AppError("Email is required",400)', async () => {
      const req = {
        body: {
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          {
            msg: 'Email is required',
          },
        ],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('AppError');
      }
      expect(next).not.toHaveBeenCalled();
      const { AppError } = await import('../utils/error.js');
      expect(AppError).toHaveBeenCalledWith('Email is required', 400);
    });

    it('3. Password is missing -> AppError("Password is required", 400)', async () => {
      const req = {
        body: {
          email: 'test@test.com',
        },
      };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Password is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Password is required');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('4. Email format is invalid -> AppError("Please enter a valid email", 400)', async () => {
      const req = {
        body: {
          email: 'invalid-email',
          password: 'test123',
        },
      };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          {
            msg: 'Please enter a valid email',
          },
        ],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Please enter a valid email');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('5. Password is too short -> AppError("Password must be at least 5 characters", 400)', async () => {
      const req = {
        body: {
          email: 'test@test.com',
          password: '123',
        },
      };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          {
            msg: 'Password must be at least 5 characters',
          },
        ],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Password must be at least 5 characters');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('6. Password does not meet policy (non-alphanumeric) -> AppError("Password must contain only letters and numbers", 400)', async () => {
      const req = {
        body: {
          email: 'test@test.com',
          password: 'pass@123',
        },
      };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          {
            msg: 'Password must contain only letters and numbers',
          },
        ],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe(
          'Password must contain only letters and numbers'
        );
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7. Request body is empty -> AppError with first validation error', async () => {
      const req = { body: {} };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('loginValidate - Input Validation', () => {
    const validateFunction = loginValidate[2];

    it('8. Valid login data -> Pass Validation', async () => {
      const req = { body: { email: 'test@test.com', password: 'anypassword' } };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      await validateFunction(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('9. Email is missing for login -> AppError("Email is required", 400)', async () => {
      const req = { body: { password: 'password123' } };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('10. Password is missing for login -> AppError("Password is required", 400)', async () => {
      const req = { body: { email: 'test@test.com' } };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Password is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Password is required');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('11. Request body is empty for login -> AppError with first validation error', async () => {
      const req = { body: {} };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.statusCode).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });
  });
});
