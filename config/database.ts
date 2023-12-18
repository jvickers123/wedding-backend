import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(process.env.MONGO_URI!);
  console.log(`MOngoDB Connected: ${conn.connection.host}`.cyan.underline);
};

export default connectDB;
