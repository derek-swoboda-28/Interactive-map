import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL || "")
    .then(async () => {
      console.log("Connected to Mongo DB!!");
    })
    .catch((err) => console.log(err));
};
