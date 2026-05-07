import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonStyles = cva(
	[
		'inline-flex items-center justify-center gap-2',
		'font-sans font-medium tracking-tight whitespace-nowrap select-none',
		'rounded-full',
		'transition-[transform,box-shadow,background-color,color]',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
	].join(' '),
	{
		variants: {
			variant: {
				primary:
					'bg-ink text-paper hover:bg-ink-soft shadow-[var(--shadow-button)]',
				secondary:
					'bg-paper text-ink border border-line hover:border-ink hover:bg-paper-dim',
				accent:
					'bg-accent text-paper hover:bg-accent-deep shadow-[var(--shadow-button)]',
				soft:
					'bg-accent-soft text-accent-deep hover:bg-accent hover:text-paper',
				ghost: 'bg-transparent text-ink hover:bg-paper-dim',
				stamp: 'bg-stamp text-paper hover:brightness-110',
			},
			size: {
				sm: 'h-9 px-5 text-sm',
				md: 'h-11 px-7 text-[15px]',
				lg: 'h-14 px-9 text-base',
				xl: 'h-16 px-10 text-lg',
			},
			block: { true: 'w-full', false: '' },
		},
		defaultVariants: { variant: 'primary', size: 'md', block: false },
	}
);

export const Button = ({
	className,
	variant,
	size,
	block,
	type = 'button',
	children,
	...props
}) => (
	<motion.button
		type={type}
		whileHover={{ y: -1 }}
		whileTap={{ scale: 0.97, y: 0 }}
		transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
		className={cn(buttonStyles({ variant, size, block }), className)}
		{...props}
	>
		{children}
	</motion.button>
);
