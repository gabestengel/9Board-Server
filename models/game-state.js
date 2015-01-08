var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rowSchema = new Schema({
	row: [Number]
});

var smallBoardSchema   = new Schema({
	row: [row]
});

var gameStateSchema = new Schema({
	currentPlayerMove: Number,
    	lastMove: {
	 	      board: Number,
        	Position: Number
    	},
    	bigBoard: [smallBoardSchema]  
});

module.exports = gameStateSchema;
