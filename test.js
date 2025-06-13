import bcrypt from "bcryptjs";

const enteredPassword = "Admin123"; // The password you're testing
const storedHash =
	"$2a$10$LBGuSsp.yAM/ETBX1dDxBuxO73CakHZvlyrOy2um2lFWUOyrxyc8C"; // The stored hash

bcrypt
	.compare(enteredPassword, storedHash)
	.then((isMatch) => console.log("Password Match:", isMatch))
	.catch((err) => console.error("Error:", err));
