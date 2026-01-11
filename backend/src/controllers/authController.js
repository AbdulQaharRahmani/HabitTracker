import { AppError } from '../utils/error.js';
import { UserModel } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { client } from '../utils/googleOAuth.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const emailExisted = await UserModel.exists({ email });
  if (emailExisted) {
    throw new AppError('Email exists already', 400);
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
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
    throw new AppError('User not existed!', 404);
  }

  const pswMatch = await bcrypt.compare(password, user.password);
  if (!pswMatch) {
    throw new AppError('Password is not correct', 400);
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

export const redirectToGoogleAuth = (req, res) => {
  //Generate Google OAuth2 login URL for user authentication
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
  });

  //return res.redirect(url)
  res.status(200).json({
    success: true,
    message: 'click to the link for login via google',
    data: url,
  });
};

export const handleGoogleCallback = async (req, res) => {
  const { code } = req.query;

  //Exchange code for tokens
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  //Verify Google ID token securely
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const googleUserinfo = ticket.getPayload();

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
