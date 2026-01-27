import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected at: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error in Connection with MongoDB`, error);
    }
}