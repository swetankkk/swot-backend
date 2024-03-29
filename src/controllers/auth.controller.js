const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
	authService,
	userService,
	tokenService,
	emailService,
} = require('../services');
const logger = require('../config/logger');

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	if (user === Error) {
		return res
			.status(httpStatus['200_Email already exists'])
			.statusMessage(
				'Account already exists with the Email, Please try loging in or Signup with another email'
			)
			.send();
	}
	const tokens = await tokenService.generateAuthTokens(user);
	res.status(httpStatus.CREATED).send({
		success: true,
		message: 'Registration Successful',
		data: { user, tokens },
	});
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send({
		success: true,
		message: 'Log in Successful',
		data: { tokens, user },
	});
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
	const tokens = await authService.refreshAuth(req.body.refreshToken);
	res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(
		req.body.email
	);
	await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
	//logger.info('request.query.token', req.query.token);
	await authService.resetPassword(req.query.token, req.body.password);
	res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
	const isEmailVerified = await authService.isEmailVerified(req.user._id);
	if (isEmailVerified) {
		res.status(httpStatus.CONFLICT).send({
			success: false,
			message: 'Email already verified',
		});
	} else {
		const verifyEmailToken = await tokenService.generateVerifyEmailToken(
			req.user
		);
		console.log('verifyEmailToken :', verifyEmailToken);
		await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
		res.status(httpStatus.ACCEPTED).send({
			success: true,
			message: 'Email Verification Sent',
		});
	}
});

const verifyEmail = catchAsync(async (req, res) => {
	try {
		const response = await authService.verifyEmail(req, res);

		res.status(httpStatus.OK).send({
			success: true,
			message: 'Email Verification Successful',
		});
	} catch (error) {
		res.status(httpStatus.BAD_REQUEST).send({
			success: false,
			message: 'BAD Request',
		});
	}
});

const getSwots = catchAsync(async (req, res) => {
	const swots = await userService.getSwots(req, res);
	if (swots) {
		res.status(httpStatus.OK).send({
			success: true,
			message: 'Swots Fetched Successful',
			data: { swots },
		});
	} else {
		res.status(httpStatus.NO_CONTENT).send({
			success: false,
			message: 'Swots Not Found',
			data: {},
		});
	}
});
const getSwot = catchAsync(async (req, res) => {
	const swots = await userService.getSwots(req, res);
	const swot = swots[req.params.id];
	if (swots[req.params.id])
		res.status(httpStatus.OK).send({
			success: true,
			message: 'Swot Fetched Successful',
			data: { swot },
		});
	else {
		res.status(httpStatus.NOT_FOUND).send({
			success: false,
			message: 'Swot Not Found',
		});
	}
});

const modifySwot = catchAsync(async (req, res) => {
	const swots = await userService.modifySwot(req, res);
	res.status(httpStatus.CREATED).send({
		success: true,
		message: 'Swot Modified Successful',
	});
});

const renameSwot = catchAsync(async (req, res) => {
	const swots = await userService.renameSwot(req, res);
	res.status(httpStatus.CREATED).send({
		success: true,
		message: 'Swot Renamed Successful',
	});
});

module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	verifyEmail,
	getSwots,
	getSwot,
	modifySwot,
	renameSwot,
};
