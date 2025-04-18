import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "../api/routes/user.route.js";
import authRouter from "../api/routes/auth.route.js";
import listingRouter from "../api/routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Configure port to work with Render or local development
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Determine the correct path for client files based on environment
const clientPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../client/dist")
    : path.join(__dirname, "/client/dist");

app.use(express.static(clientPath));

app.get("*", (req, res) => {
  const indexPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../client/dist/index.html")
      : path.join(__dirname, "client", "dist", "index.html");

  res.sendFile(indexPath);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
