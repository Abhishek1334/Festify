import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
	getAllUsers,
	getAllEvents,
	deleteEvent
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Get all users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// ✅ Get all events
router.get("/events", protect, authorizeRoles("admin"), getAllEvents);

// ✅ Delete an event
router.delete("/events/:eventId", protect, authorizeRoles("admin"), deleteEvent);

export default router;