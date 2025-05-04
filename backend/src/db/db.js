import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log("Database connected")
    } catch (error) {
       console.log("Error  connecting with database") 
       process.exist(1)
    }
}