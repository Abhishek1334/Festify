import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '../../lib/cn';

export const NumberTicker = ({
	value,
	duration = 1400,
	className,
	prefix = '',
	suffix = '',
}) => {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: '-30px' });
	const [display, setDisplay] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			setDisplay(value);
			return;
		}
		let startTs;
		let frame;
		const tick = (ts) => {
			if (!startTs) startTs = ts;
			const t = Math.min((ts - startTs) / duration, 1);
			const eased = 1 - Math.pow(1 - t, 3);
			setDisplay(Math.floor(eased * value));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [inView, value, duration]);

	return (
		<span ref={ref} className={cn('tabular', className)}>
			{prefix}
			{display.toLocaleString()}
			{suffix}
		</span>
	);
};
