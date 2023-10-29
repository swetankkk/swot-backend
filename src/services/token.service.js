const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');
const logger = require('../config/logger');
const httpStatus = require('http-status');

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(
		config.jwt.accessExpirationMinutes,
		'minutes'
	);
	const accessToken = generateToken(
		user.id,
		accessTokenExpires,
		tokenTypes.ACCESS
	);

	const refreshTokenExpires = moment().add(
		config.jwt.refreshExpirationDays,
		'days'
	);
	const refreshToken = generateToken(
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH
	);
	await saveToken(
		refreshToken,
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH
	);
	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted,
	});
	return tokenDoc;
};

const verifyToken = async (req, type, res) => {
	const payload = await jwt.verify(req.query.token, config.jwt.secret);
	const token = req.query.token;
	const tokenDoc = await Token.findOne({
		token,
		type,
		user: payload.sub,
		blacklisted: false,
	});
	if (!tokenDoc) {
		res.status(httpStatus.BAD_REQUEST).send({
			success: false,
			message: 'BAD Request',
		});
	}
	return tokenDoc;
};

const generateVerifyEmailToken = async (user) => {
	const expires = moment().add(
		config.jwt.verifyEmailExpirationMinutes,
		'minutes'
	);
	const verifyEmailToken = generateToken(
		user.id,
		expires,
		tokenTypes.VERIFY_EMAIL
	);
	await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
	return verifyEmailToken;
};

module.exports = {
	generateToken,
	generateAuthTokens,
	verifyToken,
	generateVerifyEmailToken,
	saveToken,
};
