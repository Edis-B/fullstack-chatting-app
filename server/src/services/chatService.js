import { Error, Types } from "mongoose";

import chatModel from "../models/Chat.js";
import chatTypes from "../common/chatTypeConstants.js";
import userModel from "../models/User.js";
import userService from "./userService.js";

export default {
	// Creates new chat with given participants and chat type
	async createNewChat(req) {
		let participantsArr = [];
		const { participants, type } = req.body;

		const unique = [...new Set(participants)];
		if (unique.length <= 1) {
			throw new Error("Not enough members for chat!");
		}

		for (const username of unique) {
			participantsArr.push(
				await userModel.findOne({ username: username })
			);
		}

		let newChatObj = {
			type: type,
			participants: participantsArr.map((x) => ({ participant: x })),
		};

		let exists;
		if (type == chatTypes.DIRECT_MESSAGES) {
			// Check if such a chat already exists
			exists = await this.checkIfChatExists(participantsArr);
		}

		if (exists) {
			throw new Error("Chat already exists!");
		}

		const newChat = await chatModel.create(newChatObj);

		await Promise.all(
			participantsArr.map((part) =>
				userModel.updateOne(
					{ _id: part._id },
					{ $push: { chats: { chat: newChat._id } } }
				)
			)
		);

		return newChat._id;
	},
	async checkIfChatExists(participantsArr) {
		for (let part of participantsArr) {
			const populatedParticipant = await part.populate({
				path: "chats.chat",
				match: { type: chatTypes.DIRECT_MESSAGES },
				populate: { path: "participants.participant" },
			});

			const populatedParticipantObj = populatedParticipant.toObject();

			populatedParticipantObj.chats.some((chatObj) => {
				// DMs have 2 participants
				for (let i = 0; i < 2; i++) {
					const user =
						chatObj.chat.participants[i].participant.username;
					if (participantsArr.some((p) => p.username == user)) {
						return true;
					}
				}
			});
		}
	},
	async getChatHistory(id) {
		const chat = chatModel
			.findOne({ _id: id })
			.populate("messages.message");

		console.log(JSON.stringify(chat, null, 10));

		if (!chat) {
			throw new Error("Chat not found!");
		}

		return chat.messages;
	},
	async sendMessage() {},
	async checkIfDMsExistWithUser(req) {
		const receiverUser = await userService.getUserByUsername(
			req.query.receiverUsername
		);

		if (!receiverUser) {
			throw new Error("Recepient not found");
		}

		const receiverId = receiverUser._id;

		if (!receiverId || !req.user || req.user._id.equals(receiverId)) {
			throw new Error("Sender or receiver not found!");
		}

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

		if (!userObj.chats) {
			return false;
		}

		return userObj.chats[0].chat._id;
	},
};
