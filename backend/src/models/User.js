import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  googleId: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  changedPasswordAt: {
    type: Date,
    default: null,
  },
  lastTimeSync: {
    type: Date,
    default: null,
  },
});

UserSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      googleId: { $ne: null },
    },
  }
);

export const UserModel = mongoose.model('User', UserSchema);
