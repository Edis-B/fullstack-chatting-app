import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
	date: {
		type: Date,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	user: {
		type: Types.ObjectId,
		ref: "User",
	},
	likes: [
		{
            _id: false,
			type: Types.ObjectId,
			ref: "User",
		},
	],
});

const commentModel = model("Comment", commentSchema);

export default commentModel;
