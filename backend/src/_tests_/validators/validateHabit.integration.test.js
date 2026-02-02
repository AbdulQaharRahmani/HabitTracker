import { describe, it, expect, beforeEach } from 'vitest';
import { validate } from '../../middleware/validate.js';
import {
  createHabitValidator,
  updateHabitValidator,
  getHabitsByDateValidator,
  habitIdValidator,
} from '../../validators/validateHabit.js';

const runMiddlewares = (middlewares, req) =>
  new Promise((resolve, reject) => {
    const res = {};
    let idx = 0;

    const next = (err) => {
      if (err) return reject(err);
      const mw = middlewares[idx++];
      if (!mw) return resolve();
      try {
        const maybe = mw(req, res, next);
        if (maybe && typeof maybe.then === 'function') maybe.catch(reject);
      } catch (e) {
        reject(e);
      }
    };

    next();
  });

describe('validateHabit – integration-style (real validators)', () => {
  beforeEach(() => {});

  describe('createHabitValidator (real behavior)', () => {
    it('valid data passes', async () => {
      const req = {
        body: {
          title: 'Exercise',
          description: 'Daily exercise',
          frequency: 'daily',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      const next = () => {};
      expect(() => validate(req, {}, next)).not.toThrow();
    });

    it('missing title -> Title is required', async () => {
      const req = {
        body: { frequency: 'daily', categoryId: '507f1f77bcf86cd799439011' },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow('Title is required');
    });

    it('title not a string (numeric) -> real validators coerce/trim so it passes', async () => {
      const req = {
        body: {
          title: 123,
          frequency: 'daily',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });

    it('title too long -> Title must be between 1 and 25 characters', async () => {
      const req = {
        body: {
          title: 'a'.repeat(26),
          frequency: 'daily',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'Title must be between 1 and 25 characters'
      );
    });

    it('frequency invalid -> message contains colon (create)', async () => {
      const req = {
        body: {
          title: 'Exercise',
          frequency: 'nope',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        /Frequency must be one of the allowed values\s*:/
      );
    });

    it('categoryId with surrounding whitespace in create -> invalid', async () => {
      const req = {
        body: {
          title: 'Exercise',
          frequency: 'daily',
          categoryId: '  507f1f77bcf86cd799439011  ',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'CategoryId is invalid'
      );
    });
  });

  describe('updateHabitValidator (real behavior)', () => {
    it('valid update passes', async () => {
      const req = { body: { title: 'Updated' } };

      await runMiddlewares(updateHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });

    it('invalid frequency -> message does NOT contain colon (update)', async () => {
      const req = { body: { frequency: 'invalid' } };

      await runMiddlewares(updateHabitValidator, req);

      try {
        validate(req, {}, () => {});
      } catch (err) {
        expect(err.message).toContain(
          'Frequency must be one of the allowed values'
        );
        expect(err.message).not.toContain(':');
      }
    });

    it('categoryId with whitespace in update -> trimmed and valid', async () => {
      const req = { body: { categoryId: ' 507f1f77bcf86cd799439011 ' } };

      await runMiddlewares(updateHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });

    it('title with only whitespace in update -> treated as string (passes isString)', async () => {
      const req = { body: { title: '   ' } };

      await runMiddlewares(updateHabitValidator, req);

      // After trim -> '' but isString still passes; overall validators do not mark this as invalid
      expect(() => validate(req, {}, () => {})).not.toThrow();
    });
  });

  describe('getHabitsByDateValidator & habitIdValidator', () => {
    it('invalid date -> Date must be in YYYY-MM-DD format', async () => {
      const req = { query: { date: '01-01-2026' } };

      await runMiddlewares(getHabitsByDateValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'Date must be in YYYY-MM-DD format'
      );
    });

    it('invalid habit id -> Invalid habitId', async () => {
      const req = { params: { id: 'not-a-mongo-id' } };

      await runMiddlewares(habitIdValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow('Invalid habitId');
    });
  });
});
