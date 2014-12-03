

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var boardSchema   = new Schema({
	board: [Number]
});

var nineBoardSchema   = new Schema({
	board: [boardSchema]
});

var gameStateSchema   = new Schema({
	currentPlayerMove: Number,
    lastMove: {
        board: Number,
        Position: Number
    },
    
   boardStates: [nineBoardSchema]  
});

module.exports = mongoose.model('gameState', gameStateSchema);
