import { cn } from '../../lib/cn';

export const Skeleton = ({ className, lines = 1, variant = 'text' }) => {
	if (variant === 'card') {
		return (
			<div
				className={cn(
					'rounded-[var(--radius-lg)] bg-paper-dim animate-pulse-soft',
					className
				)}
			/>
		);
	}
	if (variant === 'image') {
		return (
			<div
				className={cn(
					'aspect-[16/10] rounded-[var(--radius)] bg-paper-dim animate-pulse-soft',
					className
				)}
			/>
		);
	}
	if (variant === 'block') {
		return (
			<div
				className={cn(
					'h-full w-full rounded-[var(--radius)] bg-paper-dim animate-pulse-soft',
					className
				)}
			/>
		);
	}

	return (
		<div className={cn('space-y-2.5', className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					className="h-3 rounded-full bg-paper-dim animate-pulse-soft"
					style={{
						width: `${100 - i * 8}%`,
						animationDelay: `${i * 90}ms`,
					}}
				/>
			))}
		</div>
	);
};
