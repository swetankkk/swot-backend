const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error(
						"Password must contain at least one letter and one number"
					);
				}
			},
		},
		role: {
			type: String,
			enum: roles,
			default: "user",
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

//userSchema.plugin(toJSON)
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/*userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
}
);

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
*/

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.isEmailTaken = async function (email, excluedeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excluedeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return await bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
