var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
	name: String,
	deviceId: String,
	facebookId: String,
	wins: {type: Number, default: 0},
    stats: {
        winsNumber: {type: Number, default: 0},
       	losses:  {type: Number, default: 0},
       	ties: {type: Number, default: 0},
       	percent: {type: Number, default: 0},
       	quitPercent: {type: Number, default: 0},
       	cumulativeScore: {type: Number, default: 0}
    },
   	pastGames: [Number]
});

module.exports = mongoose.model('user', userSchema);
