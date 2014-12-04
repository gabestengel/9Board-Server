var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
	board: [Number]
});

var nineBoardSchema   = new Schema({
	board: [boardSchema]
});

var gameStateSchema = new Schema({
	currentPlayerMove: Number,
    	lastMove: {
	 	board: Number,
        	Position: Number
    	},
    	boardStates: [NineBoardSchema]  
});

module.exports = mongoose.model('GameState', gameStateSchema);
