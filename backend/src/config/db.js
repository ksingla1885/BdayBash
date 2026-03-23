import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads in development
 * and function invocations in serverless environments like Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('❌ MONGO_URI is missing in environment variables');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering so we get immediate errors if connection fails
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e.message);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
