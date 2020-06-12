const mongoose = require('mongoose');

const chatUserMappingSchema = mongoose.Schema(
	{
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChatDetails',
			required: true
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'User',
			required: true
		},
		lastSeenMessageId: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'ChatMessageDetails'
		}
	}
);

const ChatUserMapping = mongoose.model('ChatUserMapping', chatUserMappingSchema);
module.exports = ChatUserMapping;
