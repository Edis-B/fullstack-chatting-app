import chatModel from "../models/Chat.js";
import chatTypes from "../common/chatTypeConstants.js";
import userModel from "../models/User.js";
import { Types } from "mongoose"

export default {
	async createNewChat(req) {
		const info = req.body;
		let idsOfParticipants = [];

		if (info.type == chatTypes.GROUP_CHAT) {
			info.participants.forEach(async (username) => {
				const user = await userModel.findOne({ username });

				idsOfParticipants.push(user._id);
			});
		} else if (info.type == chatTypes.DIRECT_MESSAGES) {
			const participant = (info.participants[0].participant);
			const receiver = await userModel.findOne({ username: participant });

			idsOfParticipants = [
				receiver._id,
				new Types.ObjectId(JSON.parse(req.cookies.userId)._id),
			];
		}

		const newChat = {
			type: info.type,
			participants: idsOfParticipants.map(x => ({ participant: x })),
		};

		const newChatId = chatModel.create(newChat);

		return newChatId;
	},
};
