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
	user: {
		ref: "User",
		type: Types.ObjectId,
	},
});

const photoModel = model("Photo", photoSchema);

export default photoModel;
