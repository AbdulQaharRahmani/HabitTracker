import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // googleId unique if present, otherwise multiple users can have no googleId
    default: null,
  },
  username: {
    type: String,
    required: true,
    trim: true,
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

export const UserModel = mongoose.model('User', UserSchema);
