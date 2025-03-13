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
			updatedAt: new Date(Date.now()),
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
		let { chatId, page } = req.query;
		page = Number(page);
		const chatQuery = chatModel.findOne({ _id: chatId });

		const chat = await chatQuery
			.populate({
				path: "messages",
				populate: {
					path: "user",
				},
				options: {
					limit: 20,
					skip: (page - 1) * 20,
					sort: {
						date: -1,
					},
				},
			})
			.lean();

		const chat2 = await chatModel
			.findOne({ _id: chatId })
			.populate({
				path: "messages",
			})
			.lean();

		if (!chat) {
			throw new Error("Chat not found!");
		}

		return chat.messages;
	},
	async sendMessage(req) {
		if (!req.user) {
			throw new Error("Not Logged in!");
		}

		if (!req.body) {
			throw new Error("No info sent");
		}

		const { chat: chatId, text } = req.body;

		const newMessage = await messageModel.create({
			text,
			// chat id
			chat: chatId,
			date: Date.now(),
			user: req.user.id,
		});

		const populatedMessage = (
			await newMessage.populate({ path: "user" })
		).toObject();

		const updatedChat = await chatModel
			.findByIdAndUpdate(
				chatId,
				{
					updatedAt: Date.now(),
					$push: {
						messages: newMessage._id,
					},
				},
				{ new: true }
			)
			.lean();

		const additionalInfo = await this.getChatInfo(chatId, req.user.id);
		let messageData = {
			message: { ...populatedMessage },
			header: { ...additionalInfo },
		};

		messageData.participants = updatedChat.participants.map((pObj) => {
			return pObj.participant;
		});

		return messageData;
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

		const id = (
			await chatModel.findById(req.query.chatId).lean()
		).participants.filter(
			(p) => p.participant._id.toString() != req.user.id
		)[0].participant;

		const result = await this.getChatInfo(req.query.chatId, req.user.id);

		return { image: result.chatImage, name: result.chatName, _id: id };
	},
	async getUserChats(req) {
		const identifier = req.query.userId ?? req.user?.id;

		if (!identifier) {
			throw new Error("Problem fetching user id!");
		}

		const user = await userModel.findById(req.user.id).lean();

		if (!user) {
			throw new Error("User not found");
		}

		let chatInfos = user.chats.map((chatObj) => {
			return this.getChatInfo(chatObj.chat, req.user.id);
		});

		try {
			chatInfos = await Promise.all(chatInfos);
		} catch (err) {
			console.log(err);
		}
		chatInfos = chatInfos.sort((a, b) => b.updatedAt - a.updatedAt);

		return chatInfos;
	},
	async getChatInfo(chatId, userId) {
		const chat = await chatModel
			.findById(chatId)
			.populate([
				{ path: "participants.participant" },
				{
					path: "messages",
					options: { sort: { date: -1 }, limit: 1 },
				},
			])
			.lean();

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

			return {
				chatName,
				chatImage,
				chatId: chat._id,
				updatedAt: chat.updatedAt,
				lastMessage:
					chat.messages.length > 0
						? {
								owner: chat.messages[0].user,
								text: chat.messages[0].text,
						  }
						: null, // Handle case where there are no messages
			};
		}
	},
};
