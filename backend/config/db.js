import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("You are successfully connected to the database");
    } catch (error) {
        console.error(`Database connection failed!: ${error.message}`);
        process.exit(1);
    }
}