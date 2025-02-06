import chatModel from "../models/Chat.js";
import chatTypes from "../common/chatTypeConstants.js";
import userModel from "../models/User.js";
import { Types } from "mongoose";
import userService from "./userService.js";

export default {
	async createNewChat(req) {
		let participantsPromises = [];
		const info = req.body;

		const currentUserId = new Types.ObjectId(
			JSON.parse(req.cookies.userId)._id
		);

		console.log(info.participants);
		for (const username of info.participants) {
			participantsPromises.push(userModel.findOne({ username }));
		}

		const participantsArr = await Promise.all(participantsPromises); // Resolve all promises at once

		let newChat = {
			type: info.type,
			participants: participantsArr.map((x) => ({ participant: x })),
		};

		if (info.type == chatTypes.DIRECT_MESSAGES) {
			for (let part of participantsArr) {
				const populatedPart = await part.populate({
					path: "chats.chat",
					match: { type: chatTypes.DIRECT_MESSAGES },
					populate: { path: "participants.participant" },
				});

				const populatedPartObj = populatedPart.toObject();

				let exists = false;

				try {
					exists = populatedPartObj.chats.some((chat) =>
						chat.chat.participants.some((participant) =>
							participantsArr.some(
								(participantInArr) =>
									participantInArr._id.toString() !=
										populatedPartObj._id.toString() &&
									participant.participant._id.toString() ===
										participantInArr._id.toString()
							)
						)
					);
				} catch (err) {
					console.log(err);
				}

				part.hasChat = exists;
			}
		}

		const chatExists = participantsArr.some((x) => x.hasChat);
		let newChatId;

		if (!chatExists) {
			newChatId = await chatModel.create(newChat);
		}

		for (const part of participantsArr) {
			if (!part.hasChat) {
				await userModel.updateOne(
					{
						_id: part._id,
					},
					{
						$push: {
							chats: {
								chat: newChatId,
							},
						},
					}
				);
			}
		}

		return newChatId;
	},
	async getChatHistory(id) {
		const chat = chatModel.findOne({ _id: id }).populate("messages");

		return chat.messages;
	},
	async sendMessage() {},
	async checkIfDMsExistFromCookie(req, receiver) {
		const user = await userService.isLoggedIn(req);
		await user.populate("chats.chat");

		const chatId = false;

		return chatId ?? false;
	},
};
