import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";
import friendStatuses from "../common/friendStatusConstants.js";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	about: String,
	banner: {
		type: String,
		match: /^https?\:\/\//,
	},
	image: {
		type: String,
		required: true,
		match: /^https?\:\/\/.+/,
	},
	photos: [
		{
			_id: false,
			type: String,
			match: /^https?\:\/\/.+/,
		},
	],
	posts: {
		type: Types.ObjectId,
		ref: "Post",
	},
	friends: [
		{
			_id: false,
			status: {
				type: String,
				enum: Object.values(friendStatuses),
			},
			friend: {
				type: Types.ObjectId,
				ref: "User",
			},
		},
	],
	chats: [
		{
			_id: false,
			chat: {
				type: Types.ObjectId,
				ref: "Chat",
			},
		},
	],
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next(); // Skip hashing if password is unchanged
	}

	const saltRounds = 10;
	this.password = await bcrypt.hash(this.password, saltRounds);
	next();
});

const userModel = model("User", userSchema);

export default userModel;
