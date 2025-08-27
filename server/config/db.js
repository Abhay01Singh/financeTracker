import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection successful");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/financeTracker`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
export default connectDB;
