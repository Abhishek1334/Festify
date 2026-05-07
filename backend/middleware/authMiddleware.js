import jwt from 'jsonwebtoken';
import process from 'process';
import User from '../models/userModel.js';

const extractToken = (req) => {
	if (req.cookies?.token) return req.cookies.token;
	const auth = req.headers.authorization;
	if (auth && auth.startsWith('Bearer ')) return auth.split(' ')[1];
	return null;
};

export const protect = async (req, res, next) => {
	const token = extractToken(req);
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized: no token' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select('-password');
		if (!user) {
			return res.status(401).json({ message: 'User not found' });
		}
		req.user = user;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token expired' });
		}
		return res.status(401).json({ message: 'Unauthorized: invalid token' });
	}
};
