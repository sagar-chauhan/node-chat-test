var express	= require('express');
var router	= express.Router();

var chatController	= require('../controllers/chatController');

/* GET request for all last chat messages*/
router.route('/last-chat-messages').get(
	chatController.getChatMessages
);

module.exports = router;