import { cn } from '../../lib/cn';

const variantStyles = {
	success: 'bg-accent-soft text-accent-deep',
	live: 'bg-accent text-paper',
	warn: 'bg-stamp/10 text-stamp',
	info: 'bg-paper-dim text-ink',
	dark: 'bg-ink text-paper',
};

const sizeStyles = {
	sm: 'h-6 px-2.5 text-[11px]',
	md: 'h-7 px-3 text-xs',
	lg: 'h-9 px-4 text-sm',
};

export const Stamp = ({
	label,
	variant = 'success',
	size = 'md',
	rotation = 0,
	dot = false,
	className,
}) => (
	<span
		style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
		className={cn(
			'inline-flex items-center gap-1.5 rounded-full font-sans font-medium tracking-tight whitespace-nowrap select-none',
			variantStyles[variant],
			sizeStyles[size],
			className
		)}
	>
		{dot && (
			<span
				className={cn(
					'inline-block size-1.5 rounded-full',
					variant === 'live' ? 'bg-paper animate-pulse-soft' : 'bg-current opacity-70'
				)}
			/>
		)}
		{label}
	</span>
);
