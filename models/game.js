var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameSchema   = new Schema({
	players: {
        //Player1 is Xs, Player 2 is Os
        player1DeviceID: String,
        player2DeviceID: String
    },
    gameStatus: {
        //Active, Paused, Quit, Done
        ongoing: String,
        ///Null, Player1, Player2
        winner: String
    },
    gameStates: [gameStateSchema]
});

module.exports = mongoose.model('game', gameSchema);
