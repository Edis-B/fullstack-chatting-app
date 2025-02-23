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
