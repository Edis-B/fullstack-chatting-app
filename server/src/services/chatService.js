import messageModel from "../models/Message.js";
import chatModel from "../models/Chat.js";
import userModel from "../models/User.js";

import { chatTypes } from "../common/entityConstraints.js";
import { AppError } from "../utils/errorUtils.js";

import userService from "./userService.js";

const chatService = {
	async createNewChat(req) {
		let participantsArr = [];
		const { participants, type } = req.body;

		const unique = [...new Set(participants)];
		if (unique.length <= 1) {
			throw new AppError("Not enough members for chat!", 400);
		}

		for (const id of unique) {
			participantsArr.push(await userModel.findById(id));
		}

		let newChatObj = {
			type: type,
			participants: participantsArr.map((x) => ({ participant: x })),
			updatedAt: new Date(Date.now()),
		};

		const exists = await this.checkIfChatExists(participantsArr);

		if (exists) {
			throw new AppError("Chat already exists!", 400);
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
		const exists = await chatModel.exists({
			$and: [
				{ "participants.participant": { $all: participantsArr } },
				{ participants: { $size: participantsArr.length } },
			],
		});

		return !!exists;
	},

	async getChatHistory(req) {
		let { chatId, page } = req.query;
		page = Number(page);
		const chat = await chatModel
			.findOne({ _id: chatId })
			.populate({
				path: "messages",
				populate: { path: "user" },
				options: {
					limit: 20,
					skip: (page - 1) * 20,
					sort: { date: -1 },
				},
			})
			.lean();

		if (!chat) {
			throw new AppError("Chat not found!", 404);
		}

		return chat.messages;
	},

	async sendMessage(req) {
		if (!req.user) {
			throw new AppError("Not Logged in!", 401);
		}

		if (!req.body) {
			throw new AppError("No info sent", 400);
		}

		const { chat: chatId, text } = req.body;

		const newMessage = await messageModel.create({
			text,
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

	async checkIfChatExistsBetween2Users(req) {
		const { userId, profileId } = req.query;

		const receiverUser = await userModel.findById(profileId);

		if (!receiverUser) {
			throw new AppError("Recipient not found", 404);
		}

		if (req.user?.id.toString() !== userId) {
			throw new AppError("Unauthorized", 403);
		}

		const userObj = (
			await userModel.findById(userId).populate({
				path: "chats.chat",
				match: { "participants.participant": profileId },
				populate: {
					path: "participants.participant",
				},
			})
		).toObject();

		const chats = userObj.chats.filter((c) => c.chat !== null);

		if (chats.length === 0) {
			return undefined;
		}

		return chats[0].chat._id;
	},

	async getChatHeader(req) {
		if (!req.user) {
			throw new AppError("Not Logged in!", 401);
		}

		const chat = await chatModel.findById(req.query.chatId).lean();

		if (!chat) {
			throw new AppError("Chat not found!", 404);
		}

		const id = chat.participants.filter(
			(p) => p.participant._id.toString() !== req.user.id
		)[0]?.participant;

		const result = await this.getChatInfo(req.query.chatId, req.user.id);

		return { image: result.chatImage, name: result.chatName, _id: id };
	},

	async getUserChats(req) {
		const identifier = req.query.userId ?? req.user?.id;

		if (!identifier) {
			throw new AppError("Problem fetching user id!", 400);
		}

		const user = await userModel.findById(req.user.id).lean();

		if (!user) {
			throw new AppError("User not found", 404);
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

		if (chat.type === chatTypes.DIRECT_MESSAGES) {
			const participantObj =
				participantsObjs.find(
					(obj) => !obj.participant._id.equals(userId)
				) ?? null;

			if (!participantObj) {
				throw new AppError("Recipient not found!", 404);
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
						: null,
			};
		}
	},
};

export default chatService;
