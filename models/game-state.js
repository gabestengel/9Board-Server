var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var samllBoardSchema = new Schema({
	board: [Number]
});

var nineBoardSchema   = new Schema({
	smallBoard: [smallBoardSchema]
});

var gameStateSchema = new Schema({
	currentPlayerMove: Number,
    	lastMove: {
	 	      board: Number,
        	Position: Number
    	},
    	bigBoard: [nineBoardSchema]  
});

module.exports = gameStateSchema;
