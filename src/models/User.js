import { Schema, Types, model } from "mongoose";
import friendStatuses from "../common/friendStatusConstants.js";

const userSchema = new Schema({
	username: String,
	passwordHash: String,
	email: String,
	friends: [
		{
			_id: false,
			friend: {
				status: {
					type: String,
					enum: Object.values(friendStatuses),
				},
				type: Types.ObjectId,
				ref: "User",
			},
		},
	],
});

const userModel = model("User", userSchema);

export default userModel;
