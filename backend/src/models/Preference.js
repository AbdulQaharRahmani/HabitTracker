import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    weekStartDay: {
      type: String,
      lowercase: true,
      enum: [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ],
      default: 'saturday',
    },
    dailyReminderTime: {
      type: String,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Format of time(24 hour). HH:mm example:(10:05)
      default: '10:00',
    },
    dailyReminderEnabled: {
      type: Boolean,
      default: false,
    },
    timezone: {
      type: String,
      default: 'Asia/Kabul',
    },
    streakAlertEnabled: {
      type: Boolean,
      default: false,
    },
    weeklySummaryEmailEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const PreferenceModel = mongoose.model('Preference', preferenceSchema);
