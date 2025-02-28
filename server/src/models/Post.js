import { Schema, Types, model } from "mongoose";

const postSchema = new Schema({
	date: {
		type: Date,
		required: true,
	},
	content: {
		type: String,
	},
	user: {
		type: Types.ObjectId,
		ref: "User",
	},
	images: [
		{
			_id: false,
			type: String,
			match: /^https?\:\/\/.+/,
		},
	],
	likes: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "User",
		},
	],
	comments: [
		{
			_id: false,
			type: Types.ObjectId,
			ref: "Comment",
		},
	],
});

const postModel = model("Post", postSchema);

export default postModel;
