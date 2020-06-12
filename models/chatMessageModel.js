const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema(
	{
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChatDetails',
			required: true
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'User',
			required: true
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		body: {
			type: String,
			default: '',
			required: true
		}
	},
	{
		timestamps: true
	}
);

const ChatMessageDetails = mongoose.model('ChatMessageDetails', chatMessageSchema);
module.exports = ChatMessageDetails;
