const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const { tokenTypes } = require("../config/tokens");

const loginUserWithEmailAndPassword = async (email, password) => {
	const user = await userService.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new Error(httpStatus.UNAUTHORIZED, "Incorrect email or password");
	}
	return user;
};

const logout = async (refreshToken) => {
	const refreshTokenDoc = await tokenService.verifyToken(
		refreshToken,
		tokenTypes.REFRESH
	);
	if (!refreshTokenDoc) {
		throw new Error(httpStatus.UNAUTHORIZED, "Invalid token");
	}
	await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(
			refreshToken,
			tokenTypes.REFRESH
		);
		const user = await userService.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await refreshTokenDoc.remove();
		return tokenService.generateAuthTokens(user);
	} catch (error) {
		throw new Error(httpStatus.UNAUTHORIZED, "Invalid token");
	}
};

const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		console.log("Log 1 :", resetPasswordToken);
		const resetPasswordTokenDoc = await tokenService.verifyToken(
			resetPasswordToken,
			tokenTypes.RESET_PASSWORD
		);
		console.log("Log 2");
		const user = await userService.getUserById(resetPasswordTokenDoc.user);
		console.log("Log 3");
		if (!user) {
			throw new Error();
		}
		console.log("Log 4");

		await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });

		console.log("Log 5");
		await userService.updateUserById(user.id, { password: newPassword });
		console.log("Log 6");
	} catch (error) {
		throw new Error(httpStatus.UNAUTHORIZED, "Password reset failed");
	}
};

const verifyEmail = async (verifyEmailToken) => {
	try {
		const verifyEmailTokenDoc = await tokenService.verifyToken(
			verifyEmailToken,
			tokenTypes.VERIFY_EMAIL
		);
		const user = await userService.getUserById(verifyEmailTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
		await userService.updateUserById(user.id, { isEmailVerified: true });
	} catch (error) {
		throw new Error(httpStatus.UNAUTHORIZED, "Email verification failed");
	}
};

module.exports = {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
};
