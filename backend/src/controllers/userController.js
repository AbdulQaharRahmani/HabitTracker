import bcrypt from 'bcryptjs';
import { AppError, notFound } from '../utils/error.js';
import { UserModel } from '../models/User.js';

export const changePassword = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id);

  if (!user) throw new notFound('User');

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatch) throw new AppError('Password is wrong', 400);

  const isPasswordSame = await bcrypt.compare(newPassword, user.password);

  if (isPasswordSame)
    throw new AppError(
      'New password cannot be the same as the current password',
      400
    );

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.changedPasswordAt = new Date();

  await user.save();

  res
    .status(200)
    .json({ success: true, message: 'Password changed successfully' });
};
