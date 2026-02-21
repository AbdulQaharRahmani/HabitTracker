import { AppError, notFound, unauthorized } from '../utils/error.js';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { ERROR_CODES } from '../utils/constant.js';
import crypto from 'crypto';
import { verifyGoogleToken } from '../utils/googleOAuth.js';
import mongoose from 'mongoose';
import { CategoryModel } from '../models/Category.js';
import { getDefaultCategories } from '../utils/defaultCategories.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/jwt.js';
import { refreshTokenModel } from '../models/RefreshToken.js';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const emailExisted = await UserModel.exists({ email });
  if (emailExisted) {
    throw new AppError(
      'Email already exists',
      400,
      ERROR_CODES.DUPLICATE,
      'email'
    );
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.create(
      [
        {
          username,
          email,
          password: hashPassword,
        },
      ],
      { session }
    );

    const defaultCategories = getDefaultCategories(user[0]._id);

    await CategoryModel.insertMany(defaultCategories, { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw notFound('User');
  }

  const pswMatch = await bcrypt.compare(password, user.password);
  if (!pswMatch) {
    throw new AppError(
      'Incorrect Password',
      400,
      ERROR_CODES.INVALID_CREDENTIAL
    );
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const hashedToken = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // expire at 7 days

  const existingToken = await refreshTokenModel.findOne({ userId: user._id });

  if (existingToken) {
    await existingToken.set({ token: hashedToken, expiresAt }).save();
  } else {
    await refreshTokenModel.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: expiresAt,
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  // send token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      token,
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};

export const googleLogin = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) throw new AppError('Token missing', 400);

  const googleUserinfo = await verifyGoogleToken(id_token);
  if (!googleUserinfo) throw new AppError('Invalid google token', 401);

  //Check user by googleId or email
  let user = await UserModel.findOne({
    $or: [{ googleId: googleUserinfo.sub }, { email: googleUserinfo.email }],
  });

  if (!user) {
    //To prevent error assign a randome password for the user
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const newUser = await UserModel.create(
        [
          {
            googleId: googleUserinfo.sub,
            email: googleUserinfo.email,
            username: googleUserinfo.name,
            profilePicture: googleUserinfo.picture,
            password: randomPassword,
          },
        ],
        { session }
      );

      user = newUser[0];

      const defaultCategories = getDefaultCategories(user._id);

      await CategoryModel.insertMany(defaultCategories, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  if (!user.googleId) {
    user.googleId = googleUserinfo.sub;
    await user.save();
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const hashedToken = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // expire at 7 days

  const existingToken = await refreshTokenModel.findOne({ userId: user._id });

  if (existingToken) {
    await existingToken.set({ token: hashedToken, expiresAt }).save();
  } else {
    await refreshTokenModel.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: expiresAt,
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  // send token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      token,
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw unauthorized();

  const hashedToken = hashRefreshToken(token);
  const storeToken = await refreshTokenModel.findOne({ token: hashedToken });

  if (!storeToken) throw notFound('Token');

  if (storeToken.expiresAt <= new Date())
    throw new AppError('Refresh token expired', 403, ERROR_CODES.FORBIDDEN);

  await refreshTokenModel.deleteOne({ token: hashedToken }); //delete previous hashed token

  const user = await UserModel.findById({ _id: storeToken.userId });
  if (!user) throw unauthorized();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // expire at 7 days

  await refreshTokenModel.create({
    userId: storeToken.userId,
    token: hashRefreshToken(refreshToken),
    expiresAt: expiresAt,
  });

  const isProduction = process.env.NODE_ENV === 'production';
  // send token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ token: accessToken });
};

export const logOutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw notFound('Token');

  const hashed = hashRefreshToken(token);
  await refreshTokenModel.deleteOne({ token: hashed });

  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logout successfully' });
};
