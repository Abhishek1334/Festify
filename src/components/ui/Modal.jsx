import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export const Modal = ({ open, onClose, title, children, className, size = 'md' }) => {
	useEffect(() => {
		if (!open) return;
		const handler = (e) => e.key === 'Escape' && onClose?.();
		window.addEventListener('keydown', handler);
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', handler);
			document.body.style.overflow = '';
		};
	}, [open, onClose]);

	const sizeClass =
		size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
					onClick={onClose}
				>
					<motion.div
						onClick={(e) => e.stopPropagation()}
						initial={{ y: 20, opacity: 0, scale: 0.97 }}
						animate={{ y: 0, opacity: 1, scale: 1 }}
						exit={{ y: 8, opacity: 0, scale: 0.98 }}
						transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
						className={cn(
							'relative w-full bg-paper-card text-ink rounded-[var(--radius-lg)] overflow-hidden',
							'shadow-[var(--shadow-card-hover)]',
							sizeClass,
							className
						)}
					>
						{title && (
							<div className="flex items-center justify-between px-6 py-4 border-b border-line">
								<h3 className="font-display text-xl font-medium">{title}</h3>
								<button
									onClick={onClose}
									aria-label="Close"
									className="size-8 grid place-items-center rounded-full hover:bg-paper-dim text-muted hover:text-ink transition-colors"
								>
									<X className="size-4" />
								</button>
							</div>
						)}
						<div className="p-6">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
