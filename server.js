var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var NineboardUser = require('./models/user.js');
var NineboardGame = require('./models/game.js');
var NineboardGameState = require('./models/game-state.js');
var tree = app.createServer();
app.post('/api/user', function(req, res){
    
});
app.get('/api/user/:id/stats', function(req,res){
    NineboardUser.find(function(err,game){
        res.json(game);
    });
});
app.get('/api/user/:id/games/active', function(req,res){
    
});
app.get('/api/user/:id/games/:gameid', function(req,res){
    
});
app.get('/api/user/:id/games/all', function(req,res){
    
});
app.get('/api/user/:id/games/past', function(req,res){
    
});
app.post('/api/:id/games/:gameid', function(req, res){
    
});
var server= app.listen(3000, function(){
    var host= server.adress().adress;
    var port= server.adress().port;
});
