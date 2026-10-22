import mongoose from 'mongoose';

export let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarkari_news';
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('----------------------------------------------------');
  console.log('[ENV VERIFICATION]');
  console.log(`- MONGODB_URI: ${uri ? 'LOADED ✅' : 'MISSING ❌'}`);
  console.log(`- GEMINI_API_KEY: ${apiKey && !apiKey.includes('your_gemini') ? 'LOADED ✅ (' + apiKey.substring(0, 8) + '...)' : 'MISSING/DEFAULT ⚠️'}`);
  console.log('----------------------------------------------------');

  // Disable buffering so queries fail or fallback immediately if DB is disconnected
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // 3 seconds fast-fail
    });
    isDbConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, DB Name: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[MongoDB Warning] Local MongoDB offline (${error.message}). Express backend will serve high-speed in-memory mock feed.`);
    return false;
  }
};
