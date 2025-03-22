import { Types, model, Schema } from "mongoose";
import { visibilityTypes } from "../common/entityConstraints.js";

const gallerySchema = new Schema({
	dateCreated: {
		type: Date,
		required: true,
	},
	name: {
		type: String,
		required: [true, "Gallery name is required!"],
	},
	visibility: {
		type: String,
		enum: Object.values(visibilityTypes),
		default: visibilityTypes.PUBLIC,
		required: [true, "Post visibility is required!"],
	},
	description: {
		type: String,
	},
	user: {
		ref: "User",
		type: Types.ObjectId,
	},
	photos: [
		{
			_id: false,
			ref: "Photo",
			type: Types.ObjectId,
		},
	],
});

const galleryModel = model("Gallery", gallerySchema);

export default galleryModel;
