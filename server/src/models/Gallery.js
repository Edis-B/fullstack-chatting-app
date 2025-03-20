import { Types, model, Schema } from "mongoose";

const gallerySchema = new Schema({
	dateCreated: {
		type: Date,
		required: true,
	},
	name: {
		type: String,
		required: [true, "Gallery name is required!"],
	},
	desctiption: {
		type: String,
	},
	gallery: {
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
