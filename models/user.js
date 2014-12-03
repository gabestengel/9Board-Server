var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
	name: String,
    deviceID: String,
    stats: {
        wins: Number,
        losses:  Number
    }    
});

module.exports = mongoose.model('user', userSchema);
