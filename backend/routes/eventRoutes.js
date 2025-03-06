import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	getEvents,
	getEventById,
	createEvent,
	updateEvent,
	deleteEvent,
	getUserEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.route("/").get(getEvents).post(protect, createEvent);
router.get("/user", protect, getUserEvents); // Move this above
router
	.route("/:id")
	.get(getEventById)
	.put(protect, updateEvent)
	.delete(protect, deleteEvent);


export default router;
