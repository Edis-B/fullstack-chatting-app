import { Types, model, Schema } from "mongoose";

const photoSchema = new Schema({
	url: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	caption: {
		type: String,
	},
	user: {
		ref: "User",
		type: Types.ObjectId,
	},
	gallery: {
		ref: "Gallery",
		type: Types.ObjectId,
	}
});

const photoModel = model("Photo", photoSchema);

export default photoModel;
