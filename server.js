var express= require('express');
var app= express();
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/test');
app.post('/user', function(req, res){
    
});
app.get('/:id/stats', function(req,res){
    
});
app.get('/:id/games/active', function(req,res){
    
});
app.get('/:id/games/:gameid', function(req,res){
    
});
app.get('/:id/games/all', function(req,res){
    
});
app.get('/:id/games/past', function(req,res){
    
});
app.post('/:id/games/:gameid', function(req, res){
    
});
var server= app.listen(3000, function(){
    var host= server.adress().adress;
    var port= server.adress().port;
});