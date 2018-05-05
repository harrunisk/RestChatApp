var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
