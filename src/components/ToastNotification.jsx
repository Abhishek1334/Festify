import { useEffect, useState } from "react";

const ToastNotification = ({ message, type, onClose }) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			onClose();
		}, 3000); // Auto-dismiss after 3 sec

		return () => clearTimeout(timer);
	}, [onClose]);

	if (!visible) return null;

	return (
		<div
			className={`fixed bottom-5 right-5 flex items-center px-4 py-3 rounded-lg shadow-md 
            ${
				type === "success"
					? "bg-green-500 text-white"
					: "bg-red-500 text-white"
			}`}
		>
			<p className="mr-4">{message}</p>
			<button
				className="text-white font-bold"
				onClick={() => {
					setVisible(false);
					onClose();
				}}
			>
				✖
			</button>
		</div>
	);
};

export default ToastNotification;
