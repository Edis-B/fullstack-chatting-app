import { Schema, Types, model } from "mongoose";
import friendStatuses from "../common/friendStatusConstants.js";

const userSchema = new Schema({
	username: String,
	passwordHash: String,
	email: String,
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

const userModel = model("User", userSchema);

export default userModel;
