import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import process from "process";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import cloudinary from "cloudinary";
dotenv.config();
connectDB();

// ✅ Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS Configuration
const corsOptions = {
	origin: process.env.NODE_ENV === 'production' 
		? [
			'https://festify-tau.vercel.app',
			'https://festify.vercel.app',
			'https://festify.up.railway.app'
		] 
		: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400, // 24 hours
	preflightContinue: false,
	optionsSuccessStatus: 204
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
