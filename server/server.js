import express from "express";
import bodyParser from "body-parser";
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

app.use(cors());
app.use(express.json());
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
