var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var gameStateSchema = require('../models/game-state.js');

var gameSchema   = new Schema({
	    players: [String],
    	gameStatus: {
		//Active, Paused, 12Quit, Done
        	ongoing: String,
        	///Null, Player1, Player2
        	winner: String
    	},
    	gameStates: [gameStateSchema]
});

module.exports = mongoose.model('game', gameSchema);
