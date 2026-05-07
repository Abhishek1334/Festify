import { useId, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Input = forwardRef(function Input(
	{ label, error, hint, className, id, type = 'text', ...props },
	ref
) {
	const autoId = useId();
	const inputId = id || autoId;

	return (
		<div className="block w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="block font-sans text-sm font-medium text-ink mb-2"
				>
					{label}
				</label>
			)}
			<input
				id={inputId}
				ref={ref}
				type={type}
				className={cn(
					'w-full bg-paper-card border border-line rounded-[var(--radius)] px-4 py-3',
					'font-sans text-base text-ink placeholder:text-muted-soft',
					'focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink transition-shadow',
					'disabled:opacity-50',
					error && 'border-stamp focus:border-stamp focus:ring-stamp/15',
					className
				)}
				{...props}
			/>
			{error && (
				<p className="mt-1.5 font-sans text-sm text-stamp">{error}</p>
			)}
			{hint && !error && (
				<p className="mt-1.5 font-sans text-sm text-muted">{hint}</p>
			)}
		</div>
	);
});

export const Textarea = forwardRef(function Textarea(
	{ label, error, hint, className, id, rows = 4, ...props },
	ref
) {
	const autoId = useId();
	const inputId = id || autoId;

	return (
		<div className="block w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="block font-sans text-sm font-medium text-ink mb-2"
				>
					{label}
				</label>
			)}
			<textarea
				id={inputId}
				ref={ref}
				rows={rows}
				className={cn(
					'w-full bg-paper-card border border-line rounded-[var(--radius)] px-4 py-3',
					'font-sans text-base text-ink placeholder:text-muted-soft',
					'focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink transition-shadow resize-y',
					'disabled:opacity-50',
					error && 'border-stamp focus:border-stamp focus:ring-stamp/15',
					className
				)}
				{...props}
			/>
			{error && (
				<p className="mt-1.5 font-sans text-sm text-stamp">{error}</p>
			)}
			{hint && !error && (
				<p className="mt-1.5 font-sans text-sm text-muted">{hint}</p>
			)}
		</div>
	);
});
