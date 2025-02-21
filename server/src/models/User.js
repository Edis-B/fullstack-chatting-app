import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";
import friendStatuses from "../common/friendStatusConstants.js";

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	image: String,
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

userSchema.pre("save", async function () {
	const saltRounds = 10;
	this.password = await bcrypt.hash(this.password, saltRounds);

	this.image = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
});

const userModel = model("User", userSchema);

export default userModel;
