import process from 'process';
import { error as logError } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
	logError(err.message, err.stack);

	const statusCode =
		res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
	const nodeEnv = (process.env.NODE_ENV || '').trim();
	const isDev = nodeEnv !== 'production';

	const body = {
		success: false,
		message: err.message || 'Internal Server Error',
	};
	if (isDev) body.stack = err.stack;

	res.status(statusCode).json(body);
};

const notFoundHandler = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

export { errorHandler, notFoundHandler };
