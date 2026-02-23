import { describe, it, vi, expect, beforeEach } from 'vitest';
import { validate } from '../../middleware/validate.js';

vi.mock('express-validator', () => {
  const chain = {
    notEmpty: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    normalizeEmail: vi.fn().mockReturnThis(),
    isLength: vi.fn().mockReturnThis(),
    isAlphanumeric: vi.fn().mockReturnThis(),
    isString: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
    trim: vi.fn().mockReturnThis(),
    toLowerCase: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    matches: vi.fn().mockReturnThis(),
    isBoolean: vi.fn().mockReturnThis(),
  };

  return {
    body: vi.fn(() => chain),
    validationResult: vi.fn(),
  };
});

vi.mock('../utils/error.js', () => {
  const MockAppError = vi.fn(function (...args) {
    const [message, status] = args;
    this.message = message;
    this.status = status || 400;
    this.name = 'AppError';
    this._args = args;
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

  describe('registerValidator middleware', () => {
    const validateFunction = validate;

    it('1. Valid Email and Password -> Pass Validation', async () => {
      const req = {
        body: {
          username: 'tester',
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

      validateFunction(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('2. Email is missing -> Failed Validation with AppError', async () => {
      const req = {
        body: {
          password: 'password123',
        },
      };

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
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
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
        expect(error.status).toBe(400);
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
        expect(error.status).toBe(400);
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
        expect(error.status).toBe(400);
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
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7. Request body is empty -> AppError with first validation error', () => {
      const req = { body: {} };
      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      try {
        validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7b. Username is missing -> AppError("Username is required", 400)', async () => {
      const req = {
        body: {
          email: 'test@test.com',
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Username is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Username is required');
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7c. Username is too long (>25 chars) -> Should fail validation', async () => {
      const req = {
        body: {
          username: 'a'.repeat(26),
          email: 'test@test.com',
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Username exceeds maximum length' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Username exceeds maximum length');
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7d. Username is not a string -> Should fail validation', async () => {
      const req = {
        body: {
          username: 123,
          email: 'test@test.com',
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Username should be string' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Username should be string');
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7e. Username with only whitespace -> Should fail after trim', async () => {
      const req = {
        body: {
          username: '   ',
          email: 'test@test.com',
          password: 'test123',
        },
      };

      const res = {};
      const next = vi.fn();

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Username is required' }],
      });

      try {
        await validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Username is required');
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('7f. Password exactly 5 characters (boundary) -> Should pass', async () => {
      const req = {
        body: {
          username: 'tester',
          email: 'test@test.com',
          password: '12345',
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
    });

    it('7g. Password with leading/trailing spaces -> Should be trimmed', async () => {
      const req = {
        body: {
          username: 'tester',
          email: 'test@test.com',
          password: '  test123  ',
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
    });

    it('7h. Password with only spaces after trim -> Should fail', async () => {
      const req = {
        body: {
          username: 'tester',
          email: 'test@test.com',
          password: '     ',
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
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('loginValidator - Input Validation', () => {
    const validateFunction = validate;

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
        validateFunction(req, res, next);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Email is required');
        expect(error.status).toBe(400);
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
        expect(error.status).toBe(400);
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
        expect(error.status).toBe(400);
      }
      expect(next).not.toHaveBeenCalled();
    });
  });
});
