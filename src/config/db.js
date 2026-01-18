import mongoose from 'mongoose';

const connectDB = async () => {
  try {
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  dbName: "rajshree_collection",
});
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log("✅ Connected DB:", conn.connection.name);

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;