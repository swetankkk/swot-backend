const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
	port: process.env.PORT,
	mongoose: {
		url: process.env.MONGODB_URL,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationDays: process.env.JWT_RESET_PASSWORD_EXPIRATION_DAYS,
		verifyEmailExpirationDays: process.env.JWT_VERIFY_EMAIL_EXPIRATION_DAYS,
	},
};
