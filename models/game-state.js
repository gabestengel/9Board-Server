var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameStateSchema   = new Schema({
	currentPlayerMove: Number,
    lastMove: {
        board: Number,
        Position: Number
    },
    //dnt yet know how we are defining boardstate
   // boardState:  
});

module.exports = mongoose.model('gameState', gameStateSchema);
