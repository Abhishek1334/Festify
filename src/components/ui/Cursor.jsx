import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const Cursor = () => {
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const sx = useSpring(x, { stiffness: 480, damping: 38, mass: 0.4 });
	const sy = useSpring(y, { stiffness: 480, damping: 38, mass: 0.4 });
	const [hover, setHover] = useState(false);
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(hover: none)').matches) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		setEnabled(true);

		const move = (e) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		const over = (e) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			const isInteractive = t.closest(
				'a, button, [role="button"], input, textarea, label, select, [data-cursor-hover]'
			);
			setHover(Boolean(isInteractive));
		};

		window.addEventListener('mousemove', move);
		document.addEventListener('mouseover', over);
		return () => {
			window.removeEventListener('mousemove', move);
			document.removeEventListener('mouseover', over);
		};
	}, [x, y]);

	if (!enabled) return null;

	return (
		<motion.div
			aria-hidden
			className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
			style={{ x: sx, y: sy }}
		>
			<motion.div
				animate={{
					scale: hover ? 1.9 : 1,
					opacity: hover ? 0.9 : 0.85,
				}}
				transition={{ type: 'spring', stiffness: 480, damping: 28 }}
				className="size-3 rounded-full bg-paper -translate-x-1/2 -translate-y-1/2"
			/>
		</motion.div>
	);
};
