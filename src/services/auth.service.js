const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const { tokenTypes } = require('../config/tokens');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const loginUserWithEmailAndPassword = async (email, password) => {
	const user = await userService.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}
	return user;
};

const logout = async (refreshToken) => {
	const refreshTokenDoc = await tokenService.verifyToken(
		refreshToken,
		tokenTypes.REFRESH
	);
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
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
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
	}
};

const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		const resetPasswordTokenDoc = await tokenService.verifyToken(
			resetPasswordToken,
			tokenTypes.RESET_PASSWORD
		);
		const user = await userService.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}

		await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });

		await userService.updateUserById(user.id, { password: newPassword });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
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
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
	}
};

const isEmailVerified = async (userId) => {
	const user = await userService.getUserById(userId);
	return user.isEmailVerified;
};
/*const isEmailVerified = async (email) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	if (user.isEmailVerified) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already verified');
	}
	return user;
}*/

module.exports = {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
	verifyEmail,
	isEmailVerified,
};
