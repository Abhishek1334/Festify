import multer from "multer";
import path from "path";

// ✅ Multer Storage Setup
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "../uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// ✅ File Filter (Only Images)
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(new Error("Images only!"));
	}
};

const upload = multer({ storage, fileFilter });

export default upload;
