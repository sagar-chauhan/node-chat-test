const chatModel	= require('../models/chatModel');

exports.findAllLastMessages = async () => {
	const data = await chatModel.aggregate([
		{
			$lookup: {
				from: 'ChatMessageDetails',
				let: { 
					chatId: '$_id'
				},
				pipeline: [
					{
						$match:	{
							$expr: {
								$eq: [ '$chatId',  '$$chatId' ],
							}
						}
					},
					{
						$sort: {
							createdAt: -1
						}
					}
				],
				as: 'messages'
			}
		},
		{ 
			$unwind : '$members'
		},
		{
			$lookup: {
				from: 'ChatUserMapping',
				let: {
					chatId: '$_id',
					userId: '$members'
				},
				pipeline: [
					{
						$match:	{
							$and: [
								{
									$expr: {
										$eq: [ '$chatId',  '$$chatId' ],
									}
								},
								{
									$expr: {
										$eq: [ '$userId',  '$$userId' ],
									}
								}
							]
						}
					}
				],
				as: 'lastSeenMessageDetails'
			}
		},
		{
			$lookup: {
				from: 'User',
				localField: 'members',
				foreignField: '_id',
				as: 'userDetails'
			}
		},
		{
			$project: {
				_id: 1,
				type: {
					$cond: {
						if: {
							$eq: [
								'$chatType',
								'direct'
							]
						},
						then: 'One to One Chat',
						else: 'Group Chat'
					}
				},
				groupName: {
					$cond: {
						if: {
							$eq: [
								'$chatType',
								'direct'
							]
						},
						then: null,
						else: '$name'
					}
				},
				chatUserName: { $arrayElemAt: ['$userDetails.userName', 0] },
				lastChatMessage: { $arrayElemAt: ['$messages.body', 0] },
				unreadCount: {
					$cond: {
						if: {
							$eq: [
								{ $indexOfArray: [ '$messages._id', { $arrayElemAt: ['$lastSeenMessageDetails.lastSeenMessageId', 0] }] },
								-1
							]
						},
						then: { 
							$size: '$messages' 
						},
						else: { 
							$indexOfArray: [ '$messages._id', { $arrayElemAt: ['$lastSeenMessageDetails.lastSeenMessageId', 0] } ]
						} 
					}
				}
			}
		},
		{
			$group: {
				_id: '$_id',
				type: {
					$first: '$type'
				},
				groupName: {
					$first: '$groupName'
				},
				lastChatMessage: {
					$first: '$lastChatMessage'
				},
				memberDetails: {
					$addToSet: {
						chatUserName: '$chatUserName',
						unreadCount: '$unreadCount'
					}
				}
			}
		}
	]);

	return data;
};