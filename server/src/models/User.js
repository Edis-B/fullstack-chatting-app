import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

import friendStatuses from "../common/friendStatusConstants.js";
import {
	usernameMinLength,
	usernameMaxLength,
	emailRegex,
	urlRegex,
	passwordSaltRounds,
} from "../common/entityConstraints.js";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: [true, "Username is already taken"],
		trim: true,
		minlength: [
			usernameMinLength,
			`Username must be at least ${usernameMinLength} characters long`,
		],
		maxlength: [
			usernameMaxLength,
			`Username must be less than ${usernameMaxLength} characters`,
		],
		index: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: [true, "Email is already in use"],
		match: [emailRegex, "Please use a valid email address"],
	},
	about: String,
	banner: {
		type: String,
		match: urlRegex,
	},
	image: {
		type: String,
		required: true,
		match: urlRegex,
	},
	photos: [
		{
			_id: false,
			type: String,
			match: urlRegex,
		},
	],
	posts: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Post",
		},
	],
	likedPosts: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Post",
		},
	],
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
	comments: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Comment",
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
	photos: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Photo",
		},
	],
	galleries: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Gallery",
		},
	],
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, passwordSaltRounds);
	next();
});

const userModel = model("User", userSchema);

export default userModel;
