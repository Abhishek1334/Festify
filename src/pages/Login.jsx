import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';

const HERO_IMAGE =
	'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1100&q=80';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await login(email, password);
			if (res?.success) {
				toast.success('Welcome back.');
				navigate('/user-profile');
			} else {
				toast.error(res?.message || 'Invalid credentials.');
			}
		} catch {
			toast.error('Something went wrong. Try again.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
			{/* Photo panel */}
			<div className="relative hidden lg:block bg-paper-dim">
				<img
					src={HERO_IMAGE}
					alt="A festival crowd in golden hour"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-tr from-ink/55 via-ink/15 to-transparent" />
				<div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 h-full text-paper">
					<div className="font-display text-3xl font-semibold tracking-tight">Festify</div>
					<div className="space-y-3 max-w-md">
						<motion.h2
							initial={{ y: 16, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
							className="font-display font-medium leading-[1.05] tracking-tight"
							style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
						>
							Welcome back to your tickets.
						</motion.h2>
						<p className="font-sans text-base text-paper/85 leading-relaxed">
							Pick up where you left off — your bookings, hosted events, and check-ins all live in your profile.
						</p>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className="flex items-center justify-center px-5 sm:px-8 lg:px-12 py-14">
				<div className="w-full max-w-sm">
					<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
						Log in
					</div>
					<h1
						className="font-display font-medium leading-[1.02] tracking-tight mb-3"
						style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)' }}
					>
						Hey, you.
					</h1>
					<p className="font-sans text-base text-muted mb-10">
						No account?{' '}
						<Link to="/signup" className="text-ink underline underline-offset-4 decoration-accent decoration-2 hover:text-accent-deep">
							Sign up
						</Link>
					</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<Input
							label="Email"
							type="email"
							required
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
						/>
						<Input
							label="Password"
							type="password"
							required
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
						/>
						<Button type="submit" variant="primary" size="lg" block disabled={submitting}>
							{submitting ? 'Signing in…' : 'Sign in'}
						</Button>
					</form>

					<div className="mt-8 pt-6 border-t border-line">
						<Stamp label="Free forever · No credit card" variant="info" size="sm" />
					</div>
				</div>
			</div>
		</div>
	);
}
