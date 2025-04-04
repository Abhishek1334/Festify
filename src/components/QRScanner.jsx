import { useEffect, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera, CameraOff, Loader2, QrCode } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL + "/api";

const QRScanner = ({ eventId, onScanSuccess }) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const token = user?.token;
	const [scannerEnabled, setScannerEnabled] = useState(false);
	const [isScanning, setIsScanning] = useState(false);
	const [scannerInstance, setScannerInstance] = useState(null);

	const handleVerification = useCallback(
		async (ticketId) => {
			toast.info("⏳ Verifying ticket...");

			try {
				const response = await axios.post(
					`${API_URL}/tickets/checkInTicket`,
					{ ticketId, eventId },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const message = response.data.message;

				if (message.includes("already checked in")) {
					toast.warning("⚠️ Ticket already checked in");
				} else if (message.includes("Event has not started")) {
					toast.info("🕒 Event has not started yet");
				} else if (message.includes("event has already ended")) {
					toast.error("⛔ Event ended - Ticket expired");
				} else if (message.includes("Check-in successful")) {
					toast.success("✅ Ticket Verified Successfully!");
					if (onScanSuccess) onScanSuccess(ticketId);
				}
			} catch (error) {
				console.error("Verification Error:", error);
				toast.error(
					error?.response?.data?.message || "❌ Verification failed"
				);
			}
		},
		[eventId, token, onScanSuccess]
	);

	useEffect(() => {
		let scanner = null;

		if (scannerEnabled) {
			scanner = new Html5QrcodeScanner("qr-reader", {
				fps: 10,
				qrbox: { width: 200, height: 200 },
				aspectRatio: 1,
				showTorchButtonIfSupported: true,
			});

			setScannerInstance(scanner);

			const onScanSuccess = async (decodedText) => {
				setIsScanning(true);
				await handleVerification(decodedText.trim());
				setIsScanning(false);
			};

			scanner.render(onScanSuccess, () => {});
		}

		return () => {
			if (scanner) {
				scanner.clear().catch(console.error);
			}
		};
	}, [scannerEnabled, handleVerification]);

	const toggleScanner = () => {
		if (scannerEnabled) {
			scannerInstance?.clear().catch(console.error);
		}
		setScannerEnabled(!scannerEnabled);
	};

	return (
		<div className="bg-white rounded-lg shadow p-4 max-w-sm mx-auto">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-2">
					<QrCode className="h-5 w-5 text-purple-600" />
					<h3 className="font-bold text-gray-900">Scan Ticket</h3>
				</div>
				<button
					onClick={toggleScanner}
					className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
						scannerEnabled
							? "bg-red-100 text-red-600 hover:bg-red-200"
							: "bg-purple-100 text-purple-600 hover:bg-purple-200"
					}`}
				>
					{scannerEnabled ? (
						<>
							<CameraOff className="h-4 w-4" />
							<span>Stop</span>
						</>
					) : (
						<>
							<Camera className="h-4 w-4" />
							<span>Start</span>
						</>
					)}
				</button>
			</div>

			{scannerEnabled ? (
				<div className="relative">
					<div
						id="qr-reader"
						className="rounded-md overflow-hidden border border-purple-200 bg-gray-50"
						style={{ height: "250px" }}
					/>
					{isScanning && (
						<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
							<Loader2 className="h-6 w-6 text-white animate-spin" />
						</div>
					)}
				</div>
			) : (
				<div className="h-48 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
					<div className="text-center text-gray-500">
						<Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
						<p className="text-sm">Click Start to scan</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default QRScanner;
