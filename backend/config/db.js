import mongoose from 'mongoose';
import process from 'process';

// Cache the connection across serverless invocations
let cached = global._mongoose;
if (!cached) {
	cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(process.env.MONGO_URI, { bufferCommands: false })
			.then((m) => m);
	}
	try {
		cached.conn = await cached.promise;
	} catch (err) {
		cached.promise = null;
		throw err;
	}
	return cached.conn;
};

export default connectDB;
