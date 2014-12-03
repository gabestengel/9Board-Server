var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
	name: String,
    deviceID: String,
    stats: {
        wins: Number,s
        losses:  Number,
        ties: Number,
        percent: Number,
        quitPercent: Number
    },
    pastGames: [Number]
});

module.exports = mongoose.model('user', userSchema);
