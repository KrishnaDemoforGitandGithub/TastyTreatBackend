import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.DATA_STRING || "", {})
      .then((e) => console.log("database connected"));
  } catch (error) {
    console.log("error connecting database");
  }
};

export default connectDB;
