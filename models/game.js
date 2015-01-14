var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var gameStateSchema = require('../models/game-state.js');
var ObjectId= mongoose.Schema.Types.ObjectId;

var gameSchema   = new Schema({
	    playerIds: [String],
		playerFacebookIds: [String],
		playerNames: [String],
		active: {type:Boolean, default:true},
		currentTurnId: String,
		winnerId: String,
		winnerName: String,
		lastMove: {
			bigBoardPosition: {type: Number, default:-1},
			smallBoardPosition: Number,
		},
    	fullBoard: [],
});

module.exports = mongoose.model('game', gameSchema);
