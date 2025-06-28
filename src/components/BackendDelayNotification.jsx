import { useEffect, useState } from "react";
import { X, Clock } from "lucide-react";

const BackendDelayNotification = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [hasShown, setHasShown] = useState(false);

	useEffect(() => {
		// Check if notification has been shown in this session
		const notificationShown = sessionStorage.getItem('backendDelayNotificationShown');
		
		if (!notificationShown && !hasShown) {
			// Show notification after a brief delay to let the page load
			const timer = setTimeout(() => {
				setIsVisible(true);
				setHasShown(true);
				sessionStorage.setItem('backendDelayNotificationShown', 'true');
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [hasShown]);

	useEffect(() => {
		if (isVisible) {
			// Auto-hide after 10 seconds
			const autoHideTimer = setTimeout(() => {
				setIsVisible(false);
			}, 10000);

			return () => clearTimeout(autoHideTimer);
		}
	}, [isVisible]);

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed top-4 right-4 z-100 animate-in slide-in-from-top-2 duration-300">
			<div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm border border-blue-500">
				<div className="flex items-start gap-3">
					<Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
					<div className="flex-1">
						<p className="text-sm font-medium mb-1">
							Backend Startup Notice
						</p>
						<p className="text-ls text-blue-100">
							The backend may take 20-30 seconds to respond due to sleep from inactivity. Thank you for your patience!
						</p>
					</div>
					<button
						onClick={handleClose}
						className="text-blue-200 hover:text-white transition-colors p-1 -mt-1 -mr-1"
						aria-label="Close notification"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default BackendDelayNotification; 