var mongoose = require('mongoose');

var GroupMessageSchema = new mongoose.Schema({
    roomname: String,
    roomUsername: String,
    message: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
