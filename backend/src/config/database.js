import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Mongodb connected');
  } catch (err) {
    console.log('❌ Database Connection Error: ', err.message);
    process.exit(1);
  }
};
