import mongoose from "mongoose";

export const connectDb = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB Connected Success");
    })
    .catch((error) => {
      console.error("Error while connecting to DB", error);
      process.exit(1);
    });
};
