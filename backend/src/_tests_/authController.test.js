import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies
vi.mock('../models/User.js', () => ({
  UserModel: {
    exists: vi.fn(),
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

import { registerUser, loginUser } from '../controllers/authController.js';
import { UserModel } from '../models/User';
import { AppError } from '../utils/error';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Controller - unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Should throw an error if email already exist', async () => {
    const req = {
      body: { email: 'zaid.nayeb11@gmail.com', password: 'Zaid1234' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    UserModel.exists.mockResolvedValue(true);

    await expect(async () => registerUser(req, res)).rejects.toThrow(AppError);
    await expect(async () => registerUser(req, res)).rejects.toThrow(
      'Email exists already'
    );
  });

  it('2. Should Register a user Successfully', async () => {
    const req = {
      body: {
        email: 'usernotexist@gmail.com',
        password: 'password',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    UserModel.exists.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('abcd1234');
    UserModel.create.mockResolvedValue({
      _id: 'user123',
      email: req.body.email,
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenLastCalledWith({
      success: true,
      message: 'User registered successfully',
    });
  });

  it("3. User doesn't Exist -> Throw AppError", async () => {
    const req = {
      body: {
        email: 'zaid.nayeb11@gmail.com',
        password: 'Zaid1234',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    UserModel.findOne.mockResolvedValue(null);
    await expect(loginUser(req, res)).rejects.toThrow(AppError);
  });

  it('4. Incorrect password -> Throw AppError', async () => {
    const req = {
      body: {
        email: 'zaid.nayeb11@gmail.com',
        password: 'Zaid1234',
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    UserModel.findOne.mockResolvedValue({
      _id: 'id123',
      email: req.body.email,
      password: req.body.password,
    });
    bcrypt.compare.mockResolvedValue(false);
    await expect(loginUser(req, res)).rejects.toThrow(AppError);
  });

  it('5. Login Successful -> Return 200 and token', async () => {
    const req = {
      body: {
        email: 'zaid.nayeb11@gmail.com',
        password: '123Zaid',
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    UserModel.findOne.mockResolvedValue({
      _id: 'id123',
      email: req.body.email,
      password: 'hashedPassword',
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token123');

    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Login Successfully',
      data: {
        token: 'token123',
        id: 'id123',
        email: req.body.email,
      },
    });
  });
});
