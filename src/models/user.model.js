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
		password: { type: String, required: true, minlength: 7, select: false },
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

userSchema.statics.isEmailTaken = async function (email, excluedeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excluedeUserId } });
	console.log("user : ", user);
	return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
