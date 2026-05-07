import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import process from 'process';
import cloudinary from 'cloudinary';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { error as logError } from './utils/logger.js';

cloudinary.v2.config({
	cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
	api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
	api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
});

const app = express();

const DEFAULT_PROD_ORIGINS = [
	'https://festify-tau.vercel.app',
	'https://festify.vercel.app',
];

const buildAllowedOrigins = () => {
	if (process.env.NODE_ENV !== 'production') {
		return ['http://localhost:5173', 'http://127.0.0.1:5173'];
	}
	const fromEnv = (process.env.FRONTEND_URLS || '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	return [...new Set([...DEFAULT_PROD_ORIGINS, ...fromEnv])];
};

const allowedOrigins = buildAllowedOrigins();

app.use(
	cors({
		origin: (origin, cb) => {
			// Same-origin requests (Vercel API) have no origin header — allow
			if (!origin) return cb(null, true);
			if (allowedOrigins.includes(origin)) return cb(null, true);
			return cb(new Error(`CORS blocked: ${origin}`));
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		maxAge: 86400,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Ensure DB is connected before any route handler runs.
// Cached across invocations on serverless.
app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (err) {
		logError('db connect', err);
		res.status(503).json({ message: 'Database unavailable' });
	}
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
