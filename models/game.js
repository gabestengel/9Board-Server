var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var gameStateSchema = require('../schemas/game-state.js');

var gameSchema   = new Schema({
	players: {
        	//Player1 is Xs, Player 2 is Os
        	player1Id: String,
        	player2Id: String
    	},
    	gameStatus: {
		//Active, Paused, 12Quit, Done
        	ongoing: String,
        	///Null, Player1, Player2
        	winner: String
    	},
    	gameStates: [gameStateSchema]
});

module.exports = mongoose.model('game', gameSchema);
