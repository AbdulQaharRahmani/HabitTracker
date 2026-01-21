import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('dayjs', () => {
  const mockDayjs = (date) => {
    const base = {
      isValid: () => true,
      startOf: () => base,
      endOf: () => base,
      toDate: () => new Date(),
      is: () => false,
      format: () => '2026-01-01',
    };
    return date ? { ...base } : base;
  };

  return {
    default: mockDayjs,
    _esModule: true,
  };
});

import { createHabit, getHabits } from '../../controllers/habitsController';
import { HabitModel } from '../../models/Habit';
import { CategoryModel } from '../../models/Category';
import { AppError } from '../../utils/error';
import { isHabitForSelectedDay } from '../../utils/habitFrequency';
import { DateHelper } from '../../utils/date';
import { HabitCompletionModel } from '../../models/HabitCompletion';

vi.mock('../../models/Habit.js');
vi.mock('../../models/Category.js');
vi.mock('../../utils/error.js', () => ({
  AppError: class MockAppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  notFound: (entity) => {
    throw new Error(`${entity} not found`);
  },
}));

vi.mock('../../utils/habitFrequency.js', () => ({
  isHabitForSelectedDay: vi.fn(),
}));

vi.mock('../../utils/date.js', () => ({
  DateHelper: {
    getStartAndEndOfToday: vi.fn(),
  },
}));

vi.mock('../../models/habitCompletion.js', () => ({
  HabitCompletionModel: {
    find: vi.fn(),
    create: vi.fn(),
    findOneAndDelete: vi.fn(),
    exists: vi.fn(),
    isAlreadyCompleted: vi.fn(),
  },
}));

describe('Create Habit', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      body: {
        title: 'Exercise',
        description: 'Daily workout',
        frequency: 'Daily',
        categoryId: 'cat123',
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Valid Data -> Should Create a habit', async () => {
    const mockHabitCounts = 5;
    const mockHabit = {
      _id: 'habit123',
      userId: 'user123',
      title: 'Exercise',
      description: 'Daily workout',
      frequency: 'Daily',
      order: 6,
      categoryId: 'cat123',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.getHabitCountByUserId.mockResolvedValue(mockHabitCounts);
    HabitModel.create.mockResolvedValue(mockHabit);

    await createHabit(req, res);

    expect(CategoryModel.doesCategoryExist).toHaveBeenCalledWith(
      'cat123',
      'user123'
    );

    expect(HabitModel.create).toHaveBeenCalledWith({
      userId: 'user123',
      title: 'Exercise',
      description: 'Daily workout',
      frequency: 'Daily',
      order: 6,
      categoryId: 'cat123',
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockHabit,
    });
  });

  it.skip('2. Missing required fields -> Should throw 400 and not create habit', async () => {
    req.body = {
      description: 'Daily workout',
      frequency: 'Daily',
      categoryId: 'cat123',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    await expect(createHabit(req, res)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
    expect(HabitModel.create).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it.skip('3. Invalid data Type -> Should throw AppError', async () => {
    req.body = {
      title: 123,
      description: 'Daily workout',
      frequency: 'Daily',
      categoryId: 'cat123',
    };

    await expect(createHabit(req, res)).rejects.toThrow();

    try {
      await createHabit(req, res);
    } catch (error) {
      expect(error.statusCode).toBe(400);
    }

    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
  });

  it('4. Error: Unauthorized -> throws 401 error', async () => {
    req.user = null;

    await expect(createHabit(req, res)).rejects.toThrow();

    try {
      await createHabit(req, res);
    } catch (error) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toContain('authorized');
    }

    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
    expect(HabitModel.create).not.toHaveBeenCalled();
  });

  it.skip('5. Invalid frequency (not in enum) -> Should throw 400 validation error', async () => {
    req.body = {
      title: 'Exercise',
      description: 'Daily workout',
      frequency: 'monthly', //invalid frequency
      categoryId: 'cat123',
    };

    await expect(createHabit(req, res)).rejects.toMatchObject({
      statusCode: 400,
    });

    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
    expect(HabitModel.create).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("6. Category doesn't exist -> Should throw 400 error", async () => {
    req.body = {
      title: 'Exercise',
      description: 'Daily workout',
      frequency: 'daily',
      categoryId: 'non-existent-cat',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(false);

    await expect(createHabit(req, res)).rejects.toThrow('Category not found');

    expect(CategoryModel.doesCategoryExist).toHaveBeenCalledWith(
      'non-existent-cat',
      'user123'
    );

    expect(HabitModel.create).not.toHaveBeenCalled();
  });

  it('7. Duplicate Habit Title -> Should throw 409 conflict error', async () => {
    req.body = {
      title: 'Exercise',
      frequency: 'Daily',
      categoryId: 'cat123',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.getHabitCountByUserId.mockResolvedValue(5);

    const duplicateError = new Error('Duplicate Key');
    duplicateError.code = 11000;
    HabitModel.create.mockRejectedValue(duplicateError);

    await expect(createHabit(req, res)).rejects.toThrow();
    try {
      await createHabit(req, res);
    } catch (error) {
      expect(error.code).toBe(409);
    }
  });

  it('8. Title > 25 character -> Should throw 400 bad request', async () => {
    req.body = {
      title: 'Title consist of more than 25 characters',
      frequency: 'Daily',
      categoryId: 'cat123',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.getHabitCountByUserId.mockResolvedValue(5);

    const validationError = new Error(
      'title is longer than the maximum allowed length (25)'
    );
    validationError.name = 'ValidationError';
    HabitModel.create.mockRejectedValue(validationError);

    await expect(createHabit(req, res)).rejects.toThrow(AppError);
  });
});

describe('Get Habits', () => {
  let req, res;
  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Get all Habits with (empty list) -> return Empty list', async () => {
    HabitModel.findByUserAndSortByOrder.mockResolvedValue([]);

    await getHabits(req, res);

    expect(HabitModel.findByUserAndSortByOrder).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: 0,
      data: [],
    });
  });

  it('2. Get all Habits with (with data) -> Return data list', async () => {
    HabitModel.findByUserAndSortByOrder.mockResolvedValue([
      {
        _id: 'habit1',
        userId: 'user123',
        title: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        order: 1,
      },

      {
        _id: 'habit2',
        title: 'Study',
        description: 'Learning Promise',
        order: 2,
      },
    ]);

    await getHabits(req, res);
    expect(HabitModel.findByUserAndSortByOrder).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: 2,
      data: [
        {
          _id: 'habit1',
          userId: 'user123',
          title: 'Exercise',
          description: 'Daily workout',
          frequency: 'daily',
          order: 1,
        },
        {
          _id: 'habit2',
          title: 'Study',
          description: 'Learning Promise',
          order: 2,
        },
      ],
    });
  });
});
