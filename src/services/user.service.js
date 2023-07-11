const httpStatus = require('http-status');
const { User } = require('../models');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
	}
	return User.create(userBody);
};

const queryUsers = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

const getUserById = async (id) => {
	return User.findById(id);
};

const getUserByEmail = async (email) => {
	return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error(httpStatus.NOT_FOUND, 'User not found');
	}
	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};

const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
};

const getSwots = async (req, res) => {
	//const swots = userService.getSwots(req.user);
	//console.log('Req.user :', req.user);
	const swots = await User.findById(req.user._id);
	return swots.swot;
	//console.log('Swots : ', swots.swot);
};
const getSwot = async (req, res) => {
	//const swots = userService.getSwots(req.user);
	//console.log('Req.user :', req.user);
	const swots = await User.findById(req.user._id);
	return swots.swot;
	//console.log('Swots : ', swots.swot);
};

const modifySwot = async (req, res) => {
	const swots = await User.findById(req.user._id);
	await User.findByIdAndUpdate(req.user._id, { swot: req.body }, { new: true });
	return swots.swot;
};

module.exports = {
	createUser,
	getUserByEmail,
	getUserById,
	queryUsers,
	updateUserById,
	deleteUserById,
	getSwots,
	getSwot,
	modifySwot,
};
