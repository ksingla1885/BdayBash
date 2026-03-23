import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('⚠️  Server is running but DB is unavailable. Fix your Atlas IP whitelist and save a file to trigger restart.');
  }
};

export default connectDB;
