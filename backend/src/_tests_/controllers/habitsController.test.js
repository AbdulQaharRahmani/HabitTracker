import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';

import {
  createHabit,
  getHabits,
  getHabitsByDate,
  updateHabit,
  deleteHabit,
  reorderHabits,
  completeHabit,
  uncompleteHabit,
} from '../../controllers/habitsController';
import { HabitModel } from '../../models/Habit';
import { CategoryModel } from '../../models/Category';
import { AppError } from '../../utils/error';
import { HabitCompletionModel } from '../../models/habitCompletion';
import { DateHelper } from '../../utils/date.js';

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
});

afterAll(() => {
  vi.useRealTimers();
});

vi.mock('../../models/Habit.js');
vi.mock('../../models/Category.js');
vi.mock('../../utils/error.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
  };
});

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

    expect(HabitModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user123',
        title: 'Exercise',
        description: 'Daily workout',
        frequency: 'Daily',
        order: 6,
        categoryId: 'cat123',
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockHabit,
    });
  });

  it('4. Error: Unauthorized -> throws 401 error', async () => {
    req.user = null;

    await expect(createHabit(req, res)).rejects.toMatchObject({
      status: 401,
      message: 'User is not authorized',
    });

    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
    expect(HabitModel.create).not.toHaveBeenCalled();
    expect(HabitModel.getHabitCountByUserId).not.toHaveBeenCalled();
  });

  it("6. Category doesn't exist -> Should throw 404 error", async () => {
    req.body = {
      title: 'Exercise',
      description: 'Daily workout',
      frequency: 'daily',
      categoryId: 'non-existent-cat',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(false);

    await expect(createHabit(req, res)).rejects.toMatchObject({
      status: 404,
      message: 'Category not found',
    });

    expect(CategoryModel.doesCategoryExist).toHaveBeenCalledWith(
      'non-existent-cat',
      'user123'
    );

    expect(HabitModel.create).not.toHaveBeenCalled();
  });
});

describe('Get Habits', () => {
  let req, res;
  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      query: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Get all Habits with (empty list) -> return Empty list', async () => {
    HabitModel.findByUserAndSortByOrder.mockResolvedValue([]);
    HabitModel.countDocuments.mockResolvedValue(0);

    await getHabits(req, res);

    expect(HabitModel.findByUserAndSortByOrder).toHaveBeenCalledWith(
      0,
      8,
      expect.objectContaining({ userId: 'user123', isDeleted: false })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      totalPages: 0,
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

    HabitModel.countDocuments.mockResolvedValue(2);

    await getHabits(req, res);
    expect(HabitModel.findByUserAndSortByOrder).toHaveBeenCalledWith(
      0,
      8,
      expect.objectContaining({ userId: 'user123', isDeleted: false })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      totalPages: 1,
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

  it('3. Error: Unauthorized -> throws 401 error', async () => {
    req.user = null;

    await expect(getHabits(req, res)).rejects.toThrow(AppError);
    await expect(getHabits(req, res)).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe('Get Habits By date', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: 'user123',
      },
      query: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Unauthorized ( no user) -> should throw 401 error', async () => {
    req.user = null;
    await expect(getHabitsByDate(req, res)).rejects.toMatchObject({
      status: 401,
    });

    expect(HabitModel.find).not.toHaveBeenCalled();
    expect(HabitCompletionModel.find).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('2. no query date -> defaults to current date and applies filtering', async () => {
    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue([
        {
          _id: 'h1',
          title: 'Exercise',
          frequency: 'daily',
          categoryId: { _id: 'cat1', name: 'Fitness' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: 'h2',
          title: 'Read',
          frequency: 'weekly',
          categoryId: { _id: 'cat2', name: 'Learning' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    });

    HabitCompletionModel.find.mockResolvedValue([{ habitId: 'h1' }]);

    const { isHabitForSelectedDay } =
      await import('../../utils/habitFrequency.js');

    isHabitForSelectedDay.mockImplementation(
      (habit) => habit.frequency === 'daily'
    );

    await getHabitsByDate(req, res);

    expect(HabitModel.find).toHaveBeenCalled();
    expect(HabitCompletionModel.find).toHaveBeenCalled();

    const data = res.json.mock.calls[0][0].data;
    expect(data).toHaveLength(1);
    expect(data[0]._id).toBe('h1');
    expect(data[0].completed).toBe(true);
    expect(data[0].category).toEqual(
      expect.objectContaining({ name: 'Fitness' })
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('3. valid date param -> uses provided date and applies filtering', async () => {
    req.query = { date: '2026-01-03' };

    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue([
        {
          _id: 'h1',
          title: 'Exercise',
          frequency: 'daily',
          categoryId: { _id: 'cat1', name: 'Fitness' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: 'h2',
          title: 'Read',
          frequency: 'weekly',
          categoryId: { _id: 'cat2', name: 'Learning' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    });

    HabitCompletionModel.find.mockResolvedValue([{ habitId: 'h2' }]);

    const { isHabitForSelectedDay } =
      await import('../../utils/habitFrequency.js');
    isHabitForSelectedDay.mockImplementation(
      (habit) => habit.frequency === 'weekly'
    );

    await getHabitsByDate(req, res);
    expect(HabitModel.find).toHaveBeenCalled();
    expect(HabitCompletionModel.find).toHaveBeenCalled();

    const data = res.json.mock.calls[0][0].data;
    expect(data).toHaveLength(1);
    expect(data[0]._id).toBe('h2');
    expect(data[0].completed).toBe(true);
    expect(data[0].category).toEqual(
      expect.objectContaining({ name: 'Learning' })
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('4. Invalid date param -> should throw 400 error', async () => {
    req.query = { date: '40-12-2026' };

    await expect(getHabitsByDate(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid date format',
    });

    expect(HabitModel.find).not.toHaveBeenCalled();
    expect(HabitCompletionModel.find).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('5. filters habits by frequency correctly', async () => {
    const habits = [
      {
        _id: 'h1',
        title: 'Exercise',
        frequency: 'daily',
        categoryId: { _id: 'cat1', name: 'Fitness' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'h2',
        title: 'Read',
        frequency: 'weekly',
        categoryId: { _id: 'cat2', name: 'Learning' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue(habits),
    });
    HabitCompletionModel.find.mockResolvedValue([{ habitId: 'h1' }]);

    const { isHabitForSelectedDay } =
      await import('../../utils/habitFrequency.js');

    isHabitForSelectedDay.mockImplementation(
      (habit) => habit.frequency === 'daily'
    );

    await getHabitsByDate(req, res);

    expect(HabitModel.find).toHaveBeenCalled();
    expect(HabitCompletionModel.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    const data = res.json.mock.calls[0][0].data;

    expect(data).toHaveLength(1);
    expect(data[0]._id).toBe('h1');
    expect(data[0].completed).toBe(true);
    expect(data[0].category).toEqual(
      expect.objectContaining({ name: 'Fitness' }),
      expect.objectContaining({ title: 'Exercise' })
    );
  });

  it('6. completion status included', async () => {
    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue([{ _id: 'h1', title: 'X' }]),
    });
    HabitCompletionModel.find.mockResolvedValue([{ habitId: 'h1' }]);
    (
      await import('../../utils/habitFrequency.js')
    ).isHabitForSelectedDay.mockReturnValue(true);

    await getHabitsByDate(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: [expect.objectContaining({ _id: 'h1', completed: true })],
      })
    );
  });

  it('7. Excludes deleted habits from query', async () => {
    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue([]),
    });
    HabitCompletionModel.find.mockResolvedValue([]);
    (
      await import('../../utils/habitFrequency.js')
    ).isHabitForSelectedDay.mockReturnValue(true);

    await getHabitsByDate(req, res);

    const findArg = HabitModel.find.mock.calls[0][0];
    expect(findArg.isDeleted).toBe(false);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('8. Excludes habits created after selected date', async () => {
    req.query = { date: '11-11-2025' };
    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockResolvedValue([]),
    });

    HabitCompletionModel.find.mockResolvedValue([]);

    const { isHabitForSelectedDay } =
      await import('../../utils/habitFrequency.js');
    isHabitForSelectedDay.mockReturnValue(true);

    await getHabitsByDate(req, res);

    const findArgs = HabitModel.find.mock.calls[0][0];
    expect(findArgs.createdAt).toHaveProperty(`$lte`);
    expect(findArgs.createdAt.$lte).toBeInstanceOf(Date);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('9.  Database error -> should propagate (or be wrapped if that’s the contract)', async () => {
    HabitModel.find.mockReturnValue({
      populate: vi.fn().mockRejectedValue(new Error('Database failure')),
    });
    await expect(getHabitsByDate(req, res)).rejects.toThrow('Database failure');
  });
});

describe('Update Habit', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      params: { id: 'habit123' },
      body: {
        title: 'New Title',
        description: 'Updated desc',
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

  it('1. Update with all valid fields', async () => {
    const updatedHabit = {
      _id: 'habit123',
      userId: 'user123',
      title: 'New Title',
      description: 'Updated desc',
      frequency: 'Daily',
      categoryId: 'cat123',
    };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.findOneAndUpdate.mockResolvedValue(updatedHabit);

    await updateHabit(req, res);

    expect(CategoryModel.doesCategoryExist).toHaveBeenCalledWith(
      'cat123',
      'user123'
    );

    expect(HabitModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'habit123', userId: 'user123' },
      {
        $set: {
          title: 'New Title',
          description: 'Updated desc',
          frequency: 'Daily',
          categoryId: 'cat123',
        },
      },
      { new: true, runValidators: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedHabit,
    });
  });

  it('2. Partial pdate (some fields)', async () => {
    req.body = { title: 'Updated Title' };
    HabitModel.findOneAndUpdate.mockResolvedValue({ _id: 'habit123' });

    await updateHabit(req, res);

    expect(HabitModel.findOneAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(CategoryModel.doesCategoryExist).not.toHaveBeenCalled();
  });

  it('3. Update only category', async () => {
    req.body = { categoryId: 'newCat123' };

    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.findOneAndUpdate.mockResolvedValue({ categoryId: 'newCat123' });
    await updateHabit(req, res);

    expect(CategoryModel.doesCategoryExist).toHaveBeenCalledWith(
      'newCat123',
      'user123'
    );
    expect(HabitModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'habit123', userId: 'user123' },
      { $set: { categoryId: 'newCat123' } },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('4. Habit not found should throw 404', async () => {
    CategoryModel.doesCategoryExist.mockResolvedValue(true);
    HabitModel.findOneAndUpdate.mockResolvedValue(null);

    await expect(updateHabit(req, res)).rejects.toMatchObject({ status: 404 });
  });

  it('5. Unauthorized (no user) should throw 401', async () => {
    req.user = null;

    await expect(updateHabit(req, res)).rejects.toMatchObject({
      status: 401,
      message: 'User is not authorized',
    });

    expect(HabitModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("6. User doesn't own habit should throw 404", async () => {
    HabitModel.findOneAndUpdate.mockResolvedValue(null);

    await expect(updateHabit(req, res)).rejects.toMatchObject({ status: 404 });
  });

  it('7. no fields provided -> throws 400', async () => {
    req.body = {};

    await expect(updateHabit(req, res)).rejects.toMatchObject({
      status: 400,
    });
  });

  it('8. invalid frequency value -> throws 400', async () => {
    req.body = { frequency: 'yearly-invalid' };

    HabitModel.findOneAndUpdate.mockRejectedValue({
      name: 'ValidationError',
    });

    await expect(updateHabit(req, res)).rejects.toBeDefined();
    await expect(updateHabit(req, res)).rejects.toThrow();
  });

  it("9. Category doesn't exist should throw 404", async () => {
    CategoryModel.doesCategoryExist.mockResolvedValue(false);

    await expect(updateHabit(req, res)).rejects.toMatchObject({
      status: 404,
      message: 'Category not found',
    });

    expect(HabitModel.findOneAndUpdate).not.toHaveBeenCalled();
  });
});

describe('Delete Habit', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      params: { id: 'habit123' },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Delete Existing Habit sets isDeleted : true', async () => {
    const habit = {
      _id: 'habit123',
      isDeleted: false,
      isOwner: vi.fn().mockReturnValue(true),
      save: vi.fn().mockResolvedValue(),
    };

    HabitModel.findById.mockResolvedValue(habit);

    await deleteHabit(req, res);

    expect(HabitModel.findById).toHaveBeenCalledWith('habit123');
    expect(habit.isOwner).toHaveBeenCalledWith('user123');
    expect(habit.isDeleted).toBe(true);
    expect(habit.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'habit deleted successfully',
    });
  });

  it('2. Habit not found should throw 404', async () => {
    HabitModel.findById.mockResolvedValue(null);

    await expect(deleteHabit(req, res)).rejects.toMatchObject({ status: 404 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('3. Unauthorized (no user) should throw 401', async () => {
    req.user = null;

    await expect(deleteHabit(req, res)).rejects.toMatchObject({
      status: 401,
      message: 'User is not authorized',
    });

    expect(HabitModel.findById).not.toHaveBeenCalled();
  });

  it('4. Habit already deleted should throw 400 AppError', async () => {
    const habit = {
      _id: 'habit123',
      isDeleted: true,
      isOwner: vi.fn().mockReturnValue(true),
      save: vi.fn(),
    };

    HabitModel.findById.mockResolvedValue(habit);

    await expect(deleteHabit(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Habit is already deleted',
    });
  });

  it('5. Database error propagates (or wrapped)', async () => {
    HabitModel.findById.mockRejectedValue(new Error('Database failure'));

    await expect(deleteHabit(req, res)).rejects.toThrow('Database failure');
  });

  it('7. should throw 403 if user is not the owner of the habit', async () => {
    req.user = { _id: 'user-1' };
    req.params = { id: 'habit-1' };

    const habitMock = {
      isOwner: vi.fn().mockReturnValue(false),
      isDeleted: false,
      save: vi.fn(),
    };

    HabitModel.findById.mockResolvedValue(habitMock);

    await expect(deleteHabit(req, res)).rejects.toMatchObject({
      message: 'You are not allowed to delete this habit',
      status: 403,
      code: 'FORBIDDEN',
      field: undefined,
      isOperational: true,
    });
  });

  it('8. Database error during save -> propagates', async () => {
    const habit = {
      _id: 'habit123',
      isDeleted: false,
      isOwner: vi.fn().mockReturnValue(true),
      save: vi.fn().mockRejectedValue(new Error('Save failed')),
    };

    HabitModel.findById.mockResolvedValue(habit);

    await expect(deleteHabit(req, res)).rejects.toThrow('Save failed');

    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Reorder Habit', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      body: {
        habits: [
          { _id: 'h1', order: 2 },
          { _id: 'h2', order: 1 },
        ],
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Reorder multiple habits successfully', async () => {
    const dbHabits = [{ _id: 'h1' }, { _id: 'h2' }];

    HabitModel.find.mockReturnValue({
      select: vi.fn().mockResolvedValue(dbHabits),
    });
    HabitModel.bulkWrite.mockResolvedValue({});

    await reorderHabits(req, res);

    expect(HabitModel.find).toHaveBeenCalledWith({
      _id: { $in: ['h1', 'h2'] },
      userId: 'user123',
    });
    expect(HabitModel.bulkWrite).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Habits order updated successfully',
    });
  });

  it('2. No habits array provided -> 400', async () => {
    req.body = {};

    await expect(reorderHabits(req, res)).rejects.toMatchObject({
      status: 400,
    });
    expect(HabitModel.find).not.toHaveBeenCalled();
  });

  it('3. Unauthorized user -> 401', async () => {
    req.user = null;

    await expect(reorderHabits(req, res)).rejects.toMatchObject({
      status: 401,
    });
    expect(HabitModel.find).not.toHaveBeenCalled();
  });

  it('4. User does not own all habits -> 403', async () => {
    HabitModel.find.mockReturnValue({
      select: vi.fn().mockResolvedValue([{ _id: 'h1' }]),
    });

    await expect(reorderHabits(req, res)).rejects.toMatchObject({
      status: 403,
      message: 'Not allowed to modify these habits',
    });
  });

  it('5. Invalid or non-existent habit IDs -> 403', async () => {
    HabitModel.find.mockReturnValue({ select: vi.fn().mockResolvedValue([]) });

    await expect(reorderHabits(req, res)).rejects.toMatchObject({
      status: 403,
    });
    expect(HabitModel.bulkWrite).not.toHaveBeenCalled();
  });

  it('6. Empty habits array -> should succeed and perform no operations', async () => {
    req.body.habits = [];

    HabitModel.find.mockReturnValue({ select: vi.fn().mockResolvedValue([]) });
    HabitModel.bulkWrite.mockResolvedValue({});

    await reorderHabits(req, res);

    expect(HabitModel.find).toHaveBeenCalledWith({
      _id: { $in: [] },
      userId: 'user123',
    });
    expect(HabitModel.bulkWrite).toHaveBeenCalledWith([]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('7. Database error during find -> propagates', async () => {
    HabitModel.find.mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error('DB find fail')),
    });

    await expect(reorderHabits(req, res)).rejects.toThrow('DB find fail');
    expect(HabitModel.bulkWrite).not.toHaveBeenCalled();
  });

  it('8. Database error during bulkWrite -> propagates', async () => {
    const dbHabits = [{ _id: 'h1' }, { _id: 'h2' }];

    HabitModel.find.mockReturnValue({
      select: vi.fn().mockResolvedValue(dbHabits),
    });
    HabitModel.bulkWrite.mockRejectedValue(new Error('bulk fail'));

    await expect(reorderHabits(req, res)).rejects.toThrow('bulk fail');
  });
});

describe('Complete Habit', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      params: { id: 'habit123' },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. Unauthorized (no user) -> 401', async () => {
    req.user = null;

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 401,
    });

    expect(HabitModel.findById).not.toHaveBeenCalled();
  });

  it('2. Habit not found -> 404', async () => {
    HabitModel.findById.mockResolvedValue(null);

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 404,
    });

    expect(HabitCompletionModel.isAlreadyCompleted).not.toHaveBeenCalled();
  });

  it('3. User does not own habit -> 403', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(false),
    };

    HabitModel.findById.mockResolvedValue(habit);

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 403,
      message: 'Not allowed to modify this habit',
    });

    expect(HabitCompletionModel.isAlreadyCompleted).not.toHaveBeenCalled();
  });

  it('4. Habit already completed today -> 400', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habit);
    HabitCompletionModel.isAlreadyCompleted.mockResolvedValue(true);

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Habit is already completed',
    });

    expect(HabitCompletionModel.create).not.toHaveBeenCalled();
  });

  it('5. Successful habit completion -> 201', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    const completion = {
      _id: 'completion123',
      habitId: 'habit123',
      userId: 'user123',
    };

    HabitModel.findById.mockResolvedValue(habit);
    HabitCompletionModel.isAlreadyCompleted.mockResolvedValue(false);
    HabitCompletionModel.create.mockResolvedValue(completion);

    await completeHabit(req, res);

    expect(HabitCompletionModel.create).toHaveBeenCalledWith({
      habitId: 'habit123',
      userId: 'user123',
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: completion,
    });
  });

  it('5b. Should not allow completing for dates more than 7 days in the past', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habit);

    // System time is mocked to 2026-01-01.
    req.body = { date: '2025-12-24' };

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 400,
    });

    expect(HabitCompletionModel.create).not.toHaveBeenCalled();
  });

  it('5c. Should not allow completing for future dates', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habit);

    // System time is mocked to 2026-01-01. I am using a future date.
    req.body = { date: '2026-01-02' };

    await expect(completeHabit(req, res)).rejects.toMatchObject({
      status: 400,
    });

    expect(HabitCompletionModel.create).not.toHaveBeenCalled();
  });

  it('6. Database error during findById -> propagates', async () => {
    HabitModel.findById.mockRejectedValue(new Error('find failed'));

    await expect(completeHabit(req, res)).rejects.toThrow('find failed');

    expect(HabitCompletionModel.isAlreadyCompleted).not.toHaveBeenCalled();
  });

  it('7. Database error during isAlreadyCompleted -> propagates', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habit);
    HabitCompletionModel.isAlreadyCompleted.mockRejectedValue(
      new Error('check failed')
    );

    await expect(completeHabit(req, res)).rejects.toThrow('check failed');

    expect(HabitCompletionModel.create).not.toHaveBeenCalled();
  });

  it('8. Database error during create -> propagates', async () => {
    const habit = {
      _id: 'habit123',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habit);
    HabitCompletionModel.isAlreadyCompleted.mockResolvedValue(false);
    HabitCompletionModel.create.mockRejectedValue(new Error('create failed'));

    await expect(completeHabit(req, res)).rejects.toThrow('create failed');

    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Uncomplete Habit', () => {
  let req, res;
  beforeEach(() => {
    req = {
      user: { _id: 'user-1' },
      params: { id: 'habit-1' },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('1. should uncomplete habit successfully', async () => {
    const habitMock = {
      _id: 'habit-1',
      isOwner: vi.fn().mockReturnValue(true),
    };

    const completionMock = { _id: 'completion-1' };

    HabitModel.findById.mockResolvedValue(habitMock);
    DateHelper.getStartAndEndOfToday.mockReturnValue([100, 200]);
    HabitCompletionModel.findOneAndDelete.mockResolvedValue(completionMock);

    await uncompleteHabit(req, res);

    expect(HabitModel.findById).toHaveBeenCalledWith('habit-1');
    expect(HabitCompletionModel.findOneAndDelete).toHaveBeenCalledWith({
      habitId: 'habit-1',
      date: { $gte: 100, $lte: 200 },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: completionMock,
    });
  });

  it('2. should throw 404 if habit is not found', async () => {
    HabitModel.findById.mockResolvedValue(null);

    await expect(uncompleteHabit(req, res)).rejects.toMatchObject({
      status: 404,
      message: 'Habit not found',
    });
  });

  it('3. should throw 401 if user is not authenticated', async () => {
    req.user = null;

    await expect(uncompleteHabit(req, res)).rejects.toMatchObject({
      status: 401,
      message: 'User is not authorized',
    });
  });

  it('4. should throw 404 if habit completion is not found ', async () => {
    const habitMock = {
      _id: 'habit-1',
      isOwner: vi.fn().mockReturnValue(true),
    };

    HabitModel.findById.mockResolvedValue(habitMock);
    DateHelper.getStartAndEndOfToday.mockReturnValue([100, 200]);
    HabitCompletionModel.findOneAndDelete.mockResolvedValue(null);

    await expect(uncompleteHabit(req, res)).rejects.toMatchObject({
      status: 404,
      message: 'HabitCompletion not found',
    });
  });

  it('5. should throw 403 if user does not own the habit', async () => {
    const habitMock = {
      isOwner: vi.fn().mockReturnValue(false),
    };

    HabitModel.findById.mockResolvedValue(habitMock);

    await expect(uncompleteHabit(req, res)).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Not allowed to modify this habit',
    });
  });
});
