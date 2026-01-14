import mongoose from "mongoose";


export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }
    try {
        await
            mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
    // try {
    //   await mongoose.connect(process.env.MONGODB_URL);
    //   console.log("Connected to MongoDB");
    // } catch (error) {
    //   console.error("Error connecting to MongoDB:", error);
    // }
}
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };

// export default connectDB;