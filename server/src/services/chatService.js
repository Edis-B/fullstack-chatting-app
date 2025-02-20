import chatModel from "../models/Chat.js";
import chatTypes from "../common/chatTypeConstants.js";
import userModel from "../models/User.js";
import { Types } from "mongoose";
import userService from "./userService.js";

export default {
	// Creates new chat with given participants and chat type
	async createNewChat(req) {
		let participantsPromises = [];
		const { participants, type } = req.body;

		for (const username of participants) {
			participantsPromises.push(userModel.findOne({ username }));
		}

		const participantsArr = await Promise.all(participantsPromises); // Resolve all promises at once

		let newChat = {
			type: type,
			participants: participantsArr.map((x) => ({ participant: x })),
		};

		if (type == chatTypes.DIRECT_MESSAGES) {
			for (let part of participantsArr) {
				const populatedParticipants = await part.populate({
					path: "chats.chat",
					match: { type: chatTypes.DIRECT_MESSAGES },
					populate: { path: "participants.participant" },
				});

				const populatedParticipantsObj =
					populatedParticipants.toObject();

				let exists = false;

				try {
					exists = populatedParticipantsObj.chats.some((chat) =>
						chat.chat.participants.some((participant) =>
							participantsArr.some(
								(participantInArr) =>
									participantInArr._id.toString() !=
										populatedParticipantsObj._id.toString() &&
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
		const chat = chatModel
			.findOne({ _id: id })
			.populate("messages.message");

		if (!chat) {
			return false;
		}

		return chat.messages;
	},
	async sendMessage() {
		
	},
	async checkIfDMsExistWithUser(req, receiverUsername) {
		const receiverId = (
			await userService.getUserByUsername(receiverUsername)
		)._id;

		const userQuery = userModel.findOne({ _id: req.user._id });

		const userObj = await userQuery
			.populate({
				path: "chats.chat",
				match: { "participants.participant": receiverId },
				populate: {
					path: "participants.participant",
				},
			})
			.exec();

		console.log(JSON.stringify(userObj, null, 4));

		const chatId = false;

		return chatId ?? false;
	},
};
