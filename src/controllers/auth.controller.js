const httpsStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
	//authService,
	userService,
	tokenService,
	//emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	//await emailService.sendVerificationEmail(user, tokens.verificationToken);
	res.status(httpsStatus.CREATED).send({ user, tokens });
});

module.exports = {
	register,
};
