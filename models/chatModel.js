const mongoose = require('mongoose');

var chatSchema = mongoose.Schema(
	{
		chatType: {
			type: String,
			required: true,
			default: 'direct'
		},
		name: {
			type: String,
			default: ''
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User',
				required: true
			}
		]
	},
	{
		timestamps: true
	}
);

const ChatDetails = mongoose.model('ChatDetails', chatSchema);
module.exports = ChatDetails;
