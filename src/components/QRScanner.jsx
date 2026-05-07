import { useEffect, useState, useCallback, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from './ui/Button';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export default function QRScanner({ eventId, onScanSuccess }) {
	const stored = JSON.parse(localStorage.getItem('user') || '{}');
	const token = stored?.token;
	const [enabled, setEnabled] = useState(false);
	const lastScanRef = useRef(0);

	const verify = useCallback(
		async (ticketId) => {
			toast.info('Verifying…', { autoClose: 1200 });
			try {
				const res = await axios.post(
					`${API_URL}/tickets/checkInTicket`,
					{ ticketId, eventId },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const msg = res.data.message || '';
				if (msg.includes('already checked in')) toast.warning('Already checked in');
				else if (msg.includes('not started')) toast.info('Event has not started');
				else if (msg.includes('ended')) toast.error('Ticket expired');
				else if (msg.includes('successful')) {
					toast.success('Checked in.');
					onScanSuccess?.(ticketId);
				}
			} catch (err) {
				toast.error(err?.response?.data?.message || 'Verification failed.');
			}
		},
		[eventId, token, onScanSuccess]
	);

	useEffect(() => {
		if (!enabled) return;
		const scanner = new Html5QrcodeScanner('qr-reader', {
			fps: 10,
			qrbox: { width: 220, height: 220 },
			aspectRatio: 1,
			showTorchButtonIfSupported: true,
		});

		const onSuccess = async (decodedText) => {
			const now = Date.now();
			if (now - lastScanRef.current < 1500) return;
			lastScanRef.current = now;
			await verify(decodedText.trim());
			scanner.clear().catch(() => {});
			setEnabled(false);
		};

		scanner.render(onSuccess, () => {});
		return () => {
			scanner.clear().catch(() => {});
		};
	}, [enabled, verify]);

	return (
		<div className="bg-paper-card rounded-[var(--radius-lg)] border border-line/60 overflow-hidden shadow-[var(--shadow-card)]">
			<div className="flex items-center justify-between border-b border-line px-5 py-4">
				<div className="font-sans text-sm font-medium text-ink">QR scanner</div>
				<Button
					size="sm"
					variant={enabled ? 'stamp' : 'accent'}
					onClick={() => setEnabled((v) => !v)}
				>
					{enabled ? (
						<>
							<CameraOff className="size-3.5" /> Stop
						</>
					) : (
						<>
							<Camera className="size-3.5" /> Start
						</>
					)}
				</Button>
			</div>

			{enabled ? (
				<div id="qr-reader" className="relative" style={{ minHeight: '280px' }} />
			) : (
				<div className="h-56 grid place-items-center text-center px-5">
					<div>
						<div className="size-12 rounded-full bg-paper-dim grid place-items-center mx-auto mb-3">
							<Camera className="size-5 text-muted" strokeWidth={1.75} />
						</div>
						<div className="font-sans text-sm text-muted">
							Press start to scan a ticket
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
