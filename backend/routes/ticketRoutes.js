import express from 'express';
import {
	bookTicket,
	getUserTickets,
	getEventTickets,
	checkInTicket,
	cancelTicket,
	verifyTicket,
	UpdateRfid,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

router.post('/book', protect, bookTicket);
router.get('/my-tickets', protect, getUserTickets);
router.get('/event/:eventId', protect, getEventTickets);
router.post('/checkInTicket', protect, authorizeRoles('organizer', 'admin'), checkInTicket);
router.delete('/cancel/:ticketId', protect, cancelTicket);
router.post('/verify', protect, verifyTicket);
router.put('/update/:ticketId', protect, UpdateRfid);

export default router;
