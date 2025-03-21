import { Schema, Types, model } from "mongoose";
import { visibilityTypes } from "../common/entityConstraints.js";

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
		required: true,
	},
	visibility: {
		type: String,
		enum: Object.values(visibilityTypes),
		default: visibilityTypes.PUBLIC,
		required: [true, "Post visibility is required!"],
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

// Validate first-time creation
postSchema.pre("save", function (next) {
	if (
		this.isNew &&
		!this.content &&
		(!this.images || this.images.length === 0)
	) {
		return next(
			new Error("Either content or at least one image is required.")
		);
	}
	next();
});

const postModel = model("Post", postSchema);

export default postModel;
