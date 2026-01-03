import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  changedPasswordAt: {
    type: Date,
    default: null,
  },
});

export const UserModel = mongoose.model('User', UserSchema);
