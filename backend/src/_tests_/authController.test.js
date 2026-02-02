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
    expect(res.json).toHaveBeenCalledWith({
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

  describe('Auth Controller - Security Tests', () => {
    it('6. Password is not returned in the response', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      UserModel.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashed_password');
      UserModel.create.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashed_password',
      });

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
      });

      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall).not.toHaveProperty('password');
      expect(responseCall).not.toHaveProperty('user');
    });

    it('7. Bcrypt.hash is called with the correct password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'CorrectPasswrod123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      UserModel.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashed_password');
      UserModel.create.mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
      });

      await registerUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('CorrectPasswrod123', 12);
    });

    it('8. bcrypt.hash throws an error -> AppError is thrown', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      UserModel.exists.mockResolvedValue(false);
      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      await expect(registerUser(req, res)).rejects.toThrow();
      expect(UserModel.create).not.toHaveBeenCalled();
    });

    it('9. UserModel.create throws a database error -> AppError is thrown', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      UserModel.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashed_password');
      UserModel.create.mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(registerUser(req, res)).rejects.toThrow();
    });
  });

  describe('Login Security Tests', () => {
    it('10. bcrypt.compare is called with correct arguments', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'plainPassword',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashed_password_from_db',
      };

      UserModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt_token');

      await loginUser(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        'hashed_password_from_db'
      );
    });

    it('11. jwt.sign is called with correct payload and secret', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      UserModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt_token');
      process.env.JWT_SECRET = 'test_secret_key';
      process.env.JWT_EXPIRES_IN = '1h';

      await loginUser(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 'user123',
          email: 'test@example.com',
        },
        'test_secret_key',
        { expiresIn: '1h' }
      );
    });

    it('12. bcrypt.compare throws an error -> AppError is thrown', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      UserModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockRejectedValue(new Error('Comparison failed'));

      await expect(loginUser(req, res)).rejects.toThrow();

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('Should handle extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@test.com';
      const req = { body: { email: longEmail, password: 'password123' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

      UserModel.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashed');
      UserModel.create.mockResolvedValue({ _id: 'user123', email: longEmail });

      await expect(registerUser(req, res)).resolves.not.toThrow();
    });
  });
});
