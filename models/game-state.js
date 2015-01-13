var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rowSchema = new Schema({
	column: [Number]
});

var smallBoardSchema   = new Schema({
	row: [rowSchema]
});

var gameStateSchema = new Schema({
	currentPlayerMove: Number,
    	lastMove: {
	 	      board: Number,
        		row: Number,
        		column: Number
    	},
    	bigBoard: [smallBoardSchema]  
});

module.exports = mongoose.model('gameState', gameStateSchema);
