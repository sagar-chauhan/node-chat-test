var chatHelper =  require('../helpers/chathelper');

module.exports = {
    async getChatMessages(req, res){
        try {
            let chatDetails = await chatHelper.findAllLastMessages();
            return res.status(200).json({
                status:	true,
                chatData: chatDetails
            });
        } catch(err) {
            console.log(err);
            return res.status(400).json({
                status: false,
                message: 'Internal error occured!'
            });
        }
    }
}
