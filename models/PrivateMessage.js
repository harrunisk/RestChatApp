var mongoose = require('mongoose');

var PrivateMessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    receiver_username:  String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PrivateMessage', PrivateMessageSchema);
