/**
 * Make any changes you need to make to the database here
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const chatModel = require('../models/chatModel');
const chatMessageModel = require('../models/chatMessageModel');
const chatUserMappingModel = require('../models/chatUserMappingModel');

up = async () => {
	await mongoose.connect('mongodb://localhost/chat-assignment', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
	const defaultValues = ['first', 'second', 'third', 'fourth']

	for (let value of defaultValues) {
		const rec = new userModel({
			email: `${ value }@gmail.com`,
			userName: value,
			password: bcrypt.hashSync(value, 8)
		});

		await rec.save();
	}

	const users = await userModel.find();

	for (let value of [0, 1]) {
		let firstUserId;
		let secondUserId;

		if (value === 0) {
			firstUserId = users[0]._id;
			secondUserId = users[1]._id;
		} else {
			firstUserId = users[2]._id;
			secondUserId = users[3]._id;
		}

		const rec = new chatModel({
			chatType: 'direct',
			members: [
				firstUserId,
				secondUserId
			]
		});

		const savedRec = await rec.save();

		for (let value of [0, 1, 3, 4]) {
			const messageRec = new chatMessageModel({
				chatId: savedRec._id,
				senderId: value%2 === 0 ? firstUserId : secondUserId,
				receiverId: value%2 === 0 ? secondUserId : firstUserId,
				body: value.toString()
			});
	
			const msgSavedRec = await messageRec.save();

			if (value === 1 || value === 4) {
				const mappingRec = new chatUserMappingModel({
					chatId: savedRec._id,
					userId: value === 1 ? firstUserId : secondUserId,
					lastSeenMessageId: msgSavedRec._id
				});
		
				await mappingRec.save();
			}
		}
	}

	const nRec = new chatModel({
		chatType: 'group',
		name: 'Dev Group',
		members: [
			users[0]._id,
			users[1]._id,
			users[2]._id,
			users[3]._id
		]
	});

	const nSavedRec = await nRec.save();

	for (let value of [0, 1, 2, 2]) {
		const newMessageRec = new chatMessageModel({
			chatId: nSavedRec._id,
			senderId: users[value]._id,
			body: `${ value }sljfl lsjfl This is for testing.`
		});

		const newMsgSavedRec = await newMessageRec.save();

		if (value === 1) {
			const mappingRec = new chatUserMappingModel({
				chatId: nSavedRec._id,
				userId: users[value]._id,
				lastSeenMessageId: newMsgSavedRec._id
			});
	
			await mappingRec.save();
		}
	}
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
down = async () => {
}

module.exports = { up, down };
