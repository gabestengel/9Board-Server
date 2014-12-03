var express= require('express');
var app= express();
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/test');
app.post('/api/user', function(req, res){
    
});
app.get('/api/:id/stats', function(req,res){
    
});
app.get('/api/:id/games/active', function(req,res){
    
});
app.get('/api/:id/games/:gameid', function(req,res){
    
});
app.get('/api/:id/games/all', function(req,res){
    
});
app.get('/api/:id/games/past', function(req,res){
    
});
app.post('/api/:id/games/:gameid', function(req, res){
    
});
var server= app.listen(3000, function(){
    var host= server.adress().adress;
    var port= server.adress().port;
});