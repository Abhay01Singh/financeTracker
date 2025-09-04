import express from "express";
import cors from "cors";
import "dotenv/config"; // Load environment variables from .env file
// Note: Using "dotenv/config" automatically calls dotenv.config()
import cookieParser from "cookie-parser";
import userRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import transactionRouter from "./routes/transactionRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import goalRouter from "./routes/goalRoutes.js";

const app = express();
const port = 3000;

await connectDB();

// cors use for cross origin requests
app.use(cors());
// express.json() is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
// cookie use for parsing cookies
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/goal", goalRouter);

app.use("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
