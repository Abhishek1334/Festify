import bcrypt from "bcryptjs";

const enteredPassword = "test1234"; // The password you're testing
const storedHash =
	"$2b$10$Ny6UFAqYodcgsJ0oH6iqEOf2ZKtO8pAyA1podIOk004nMBNN1ck6a"; // The stored hash

bcrypt
	.compare(enteredPassword, storedHash)
	.then((isMatch) => console.log("Password Match:", isMatch))
	.catch((err) => console.error("Error:", err));
