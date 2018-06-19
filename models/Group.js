var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    roomname: String,
    GroupCreaterUsername: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
