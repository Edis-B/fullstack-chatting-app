import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema({
    text: String,
	date: Date,
	chat: {
		type: Types.ObjectId,
		ref: "Chat",
	},
	user: {
		type: Types.ObjectId,
		ref: "User",
	},
});

const messageModel = model("Message", messageSchema);

export default messageModel;
