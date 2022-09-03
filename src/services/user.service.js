const httpsStatus = require("http-status");
const { User } = require("../models");

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new Error("Email already taken");
	}
	return User.create(userBody);
};

module.exports = {
	createUser,
};
