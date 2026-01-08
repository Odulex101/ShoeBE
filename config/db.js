import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;

// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// };

// export default connectDB;
