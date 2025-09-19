import "dotenv/config";
import express from "express";
import { connectDb } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

// Routes imports
import authRoutes from "./routes/auth.routes.js";

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
