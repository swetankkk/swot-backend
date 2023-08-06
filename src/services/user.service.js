const httpStatus = require('http-status');
const { User } = require('../models');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

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
	//to be modified and corrected
	//const swots = userService.getSwots(req.user);
	//console.log('Req.user :', req.user);
	const swots = await User.findById(req.user._id);
	return swots.swot;
	//console.log('Swots : ', swots.swot);
};

const modifySwot = async (req, res) => {
	const swots = await User.findById(req.user._id);
	const id = req.params.id;
	const update = {
		[`swot.${id}.strength`]: req.body.strength,
		[`swot.${id}.weakness`]: req.body.weakness,
		[`swot.${id}.opportunities`]: req.body.opportunities,
		[`swot.${id}.threats`]: req.body.threats,
	};
	await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true });
	return swots.swot;
};
/*const renameSwot = async (req, res) => {
	const swots = await User.findById(req.user._id);
	const id = req.params.id;
	const newName = req.body.name;
	const swot = swots.swot;

	// Copy the swot object and delete the property with the old name
	const updatedSwot = { ...swot };
	delete updatedSwot[id];

	// Create the update object with the new name
	const update = {
		[`swot.${newName}`]: swot[id],
	};

	console.log('Update2 : ', update);

	// Update the user with the new swot object
	await User.findByIdAndUpdate(
		req.user._id,
		{ $set: updatedSwot },
		{ new: true }
	);

	return updatedSwot;
};*/

const renameSwot = async (req, res) => {
	const swots = await User.findById(req.user._id);
	const id = req.params.id;
	const newName = req.body.name;
	const swot = swots.swot;

	// Delete the property with the old name

	// Add the property with the new name
	swot[newName] = swot[id];
	delete swot[id];

	// Update the user with the new swot object
	await User.findByIdAndUpdate(
		req.user._id,
		{ $set: { swot: swot } },
		{ new: true }
	);

	return swot;
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
	renameSwot,
};
