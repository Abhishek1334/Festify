import { cn } from '../../lib/cn';

export const Spinner = ({ className, size = 16 }) => (
	<span
		role="status"
		aria-label="Loading"
		className={cn(
			'inline-block border-2 border-ink border-t-transparent rounded-full animate-spin',
			className
		)}
		style={{ width: size, height: size }}
	/>
);
