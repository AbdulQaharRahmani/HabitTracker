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

describe('validateHabit (real validators)', () => {
  beforeEach(() => {});

  describe('createHabitValidator (real behavior)', () => {
    it('1. valid data passes', async () => {
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

    it('2. missing title -> Title is required', async () => {
      const req = {
        body: { frequency: 'daily', categoryId: '507f1f77bcf86cd799439011' },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow('Title is required');
    });

    it('3. title not a string -> real validators trim so it passes', async () => {
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

    it('4. title too long -> Title must be between 1 and 25 characters', async () => {
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

    it('5. frequency invalid -> message contains colon (create)', async () => {
      const req = {
        body: {
          title: 'Exercise',
          frequency: 'wrongvalue',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'Frequency must be one of the allowed values : daily,every-other-day,weekly,biweekly,weekdays,weekends'
      );
    });

    it('6. categoryId with surrounding whitespace in create -> invalid', async () => {
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

    it('7. missing frequency -> Frequency is required', async () => {
      const req = {
        body: {
          title: 'Exercise',
          categoryId: '507f1f77bcf86cd799439011',
        },
      };

      await runMiddlewares(createHabitValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'Frequency is required'
      );
    });
  });

  describe('updateHabitValidator (real behavior)', () => {
    it('8. valid update passes', async () => {
      const req = { body: { title: 'Updated' } };

      await runMiddlewares(updateHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });

    it('9. invalid frequency -> message does NOT contain colon (update)', async () => {
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

    it('10.categoryId with whitespace in update -> trimmed and valid', async () => {
      const req = { body: { categoryId: ' 507f1f77bcf86cd799439011 ' } };

      await runMiddlewares(updateHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });

    it('11. title with only whitespace in update -> treated as string (passes isString)', async () => {
      const req = { body: { title: '   ' } };

      await runMiddlewares(updateHabitValidator, req);

      expect(() => validate(req, {}, () => {})).not.toThrow();
    });
  });

  describe('getHabitsByDateValidator & habitIdValidator', () => {
    it('12. invalid date -> Date must be in YYYY-MM-DD format', async () => {
      const req = { query: { date: '01-01-2026' } };

      await runMiddlewares(getHabitsByDateValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow(
        'Date must be in YYYY-MM-DD format'
      );
    });

    it('13. invalid habit id -> Invalid habitId', async () => {
      const req = { params: { id: 'not-a-mongo-id' } };

      await runMiddlewares(habitIdValidator, req);

      expect(() => validate(req, {}, () => {})).toThrow('Invalid habitId');
    });
  });
});
