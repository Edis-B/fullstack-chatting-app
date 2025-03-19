import { Schema, Types, model } from "mongoose";

const postSchema = new Schema({
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

// Pre-save hook to validate first-time creation
postSchema.pre("save", function (next) {
	if (this.isNew && !this.content && (!this.images || this.images.length === 0)) {
		return next(new Error("Either content or at least one image is required."));
	}
	next();
});

const postModel = model("Post", postSchema);

export default postModel;
