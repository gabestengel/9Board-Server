var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
	name: String,
	deviceID: String,
	facebookID: String,
	wins: Number,
    	stats: {
        	winsNumber: Number,
        	losses:  Number,
        	ties: Number,
        	percent: Number,
        	quitPercent: Number,
        	cumulativeScore: Number
    	},
    	pastGames: [Number]
});

module.exports = mongoose.model('user', userSchema);
