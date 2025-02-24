import { Error, Types } from "mongoose";

import messageModel from "../models/Message.js";
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
	async getChatHistory(req) {
		const chatQuery = chatModel.findOne({ _id: req.query.chatId });

		const chat = await chatQuery
			.populate({
				path: "messages",
				populate: {
					path: "user",
				},
			})
			.lean();

		if (!chat) {
			throw new Error("Chat not found!");
		}

		const messageObjs = chat.messages;

		for (const message of messageObjs) {
			if (message.user.username == req.user.username) {
				message.isMine = true;
			} else {
				message.isMine = false;
			}
		}

		return messageObjs;
	},
	async sendMessage(req) {
		if (!req.user) {
			throw new Error("Not Logged in!");
		}

		if (!req.body) {
			throw new Error("No info sent");
		}

		const { chat, text } = req.body;

		const newMessage = await messageModel.create({
			text,
			chat,
			date: Date.now(),
			user: req.user._id,
		});

		await chatModel.findByIdAndUpdate(chat, {
			$push: {
				messages: newMessage._id,
			},
		});

		return newMessage._id;
	},
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
	async getChatHeader(req) {
		if (!req.user) {
			throw new Error("Not Logged in!");
		}

		const chat = await chatModel
			.findById(req.query.chatId)
			.populate("participants.participant")
			.lean();

		const result = this.getChatInfo(chat, req.user.id);

		return { image: result.chatImage, name: result.chatName };
	},
	async getUsersChats(req) {
		if (!req.user) {
			throw new Error("Not Logged in!");
		}

		const user = await userModel
			.findById(req.user.id)
			.populate({
				path: "chats.chat",
				populate: "participants.participant"
			})
			.lean();

		const chatInfos = user.chats.map((chatObj) => {
			return this.getChatInfo(chatObj.chat, req.user.id);
		});

		return chatInfos;
	},
	getChatInfo(chat, userId) {
		let chatName, chatImage;
		const participantsObjs = chat.participants;

		if (chat.type == chatTypes.DIRECT_MESSAGES) {
			const participantObj =
				participantsObjs.filter(
					(obj) => !obj.participant._id.equals(userId)
				)[0] ?? null;

			if (!participantObj) {
				throw new Error("Recepient not found!");
			}

			chatName = participantObj.participant.username;
			chatImage = participantObj.participant.image;

			return { chatName, chatImage, _id: chat._id };
		}
	},
};
