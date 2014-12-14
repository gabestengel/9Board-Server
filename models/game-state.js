var mongoose = require('mongoose');
var gameStateSchema = require('../schemas/game-state.js');
module.exports = mongoose.model('GameState', gameStateSchema);