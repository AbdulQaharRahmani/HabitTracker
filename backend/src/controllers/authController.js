import { AppError, notFound } from '../utils/error.js';
import { UserModel } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ERROR_CODES } from '../utils/constant.js';
import crypto from 'crypto';
import { verifyGoogleToken } from '../utils/googleOAuth.js';

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

  await UserModel.create({
    username,
    email,
    password: hashPassword,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
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

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      token,
      id: user._id,
      email: user.email,
      username: user.username,
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
    const newUser = await UserModel.create({
      googleId: googleUserinfo.sub,
      email: googleUserinfo.email,
      username: googleUserinfo.name,
      profilePicture: googleUserinfo.picture,
      password: randomPassword,
    });
    user = newUser;
  }

  if (!user.googleId) {
    user.googleId = googleUserinfo.sub;
    await user.save();
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      token,
      id: user._id,
      email: user.email,
    },
  });
};
