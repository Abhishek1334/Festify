import bcrypt from "bcryptjs";

const enteredPassword = "test1234"; // The password you're testing
const storedHash =
	"$2b$10$kzTcjFSKuPWAJcOx5MB5tu8p8NrMVpMbR4wpxbpue9j/Orwy58wo."; // The stored hash

bcrypt
	.compare(enteredPassword, storedHash)
	.then((isMatch) => console.log("Password Match:", isMatch))
	.catch((err) => console.error("Error:", err));
