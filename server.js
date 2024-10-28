import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from 'cors';
import morgan from 'morgan';
import "express-async-errors";

import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import errorMiddleware from "./middlewares/errorMiddleware.js";
import jobRoutes from './routes/jobRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Use 'dev' for better logging during development

// Routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job',jobRoutes)

// Error Middleware
app.use(errorMiddleware);

// Port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(
        `Node server is running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.green
    );
});
