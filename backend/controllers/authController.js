import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import process from 'process';
import { error as logError } from '../utils/logger.js';

export const generateToken = (userId) =>
	jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => {
	const isProd = process.env.NODE_ENV === 'production';
	return {
		httpOnly: true,
		secure: isProd,
		// On Vercel the API and frontend share an origin, so 'lax' is correct + safer than 'none'.
		// If you ever deploy the API to a different domain than the frontend, switch to 'none'.
		sameSite: 'lax',
		maxAge: SEVEN_DAYS_MS,
		path: '/',
	};
};

const setAuthCookie = (res, token) => {
	res.cookie('token', token, cookieOptions());
};

// @route POST /api/auth/signup
export const registerUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		const normalizedEmail = email.toLowerCase();

		const existing = await User.findOne({
			$or: [{ email: normalizedEmail }, { name }],
		});
		if (existing) {
			if (existing.email === normalizedEmail) {
				return res.status(400).json({ message: 'Email already in use' });
			}
			if (existing.name === name) {
				return res.status(400).json({ message: 'Username already taken' });
			}
		}

		const user = new User({ name, email: normalizedEmail, password });
		await user.save();

		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.status(201).json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token,
		});
	} catch (err) {
		logError('signup', err);
		res.status(500).json({ message: 'Server error, please try again later' });
	}
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const normalizedEmail = email.toLowerCase();
		const user = await User.findOne({ email: normalizedEmail });

		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token,
			tokenExpiry: '7d',
		});
	} catch (err) {
		logError('login', err);
		res.status(500).json({ message: 'Server error. Please try again later.' });
	}
};

// @route POST /api/auth/logout
export const logoutUser = async (req, res) => {
	try {
		res.clearCookie('token', { ...cookieOptions(), maxAge: undefined });
		res.status(200).json({ message: 'Logged out' });
	} catch (err) {
		logError('logout', err);
		res.status(500).json({ message: 'Logout failed' });
	}
};
