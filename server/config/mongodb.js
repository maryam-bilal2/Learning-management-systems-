// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const connectDB = async () => { 
//   try {
//     const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}`);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.log("MongoDB connection failed", error.message);
    
//   }
// }


// export default connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => { 
  try {
    const connectionDB = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    console.log(`MongoDB Connected: ${connectionDB.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1); // stop backend if DB fails
  }
}

export default connectDB;
