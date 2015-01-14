var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var gameStateSchema = require('../models/game-state.js');
var ObjectId= mongoose.Schema.Types.ObjectId;

var gameSchema   = new Schema({
	    players: [String],
		active: {type:Boolean, default:true},
		winnerId: String,
    	fullBoard: []
});

module.exports = mongoose.model('game', gameSchema);
