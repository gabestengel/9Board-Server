var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var NineboardUser = require('./models/user.js');
var NineboardGame = require('./models/game.js');
var NineboardGameState = require('./models/game-state.js');

app.post('/api/user', function(req, res){
    NineboardUser.save(function(err){
        if(!err){
            res.send("created");
        }
        else{
            res.send(err);
        }
    });
});
//need some help understanding this function
app.get('/api/user/:id/stats', function(req,res){
    NineboardUser.findById(req.params.id, function(err,person){
        if(!err){
            res.json(person.stats);
        }
        else{
            res.send(err);
        }
    });
});
app.get('/api/user/:id/games/active', function(req,res){
    NineboardUser.findById(req.params.id,function(err, person){
       if(!err){
           NineboardGame.find({'players':person.DeviceID}, function(err,game)){
                if(!err){
                    for(var i=0; i<game.length; i++){
                        if(game.gamestatus.ongoing=JSON.parse("Active")){
                            res.json(game);
                        }
                    }
                }
                else{
                    res.send(err);
                }
            });
       }
       else{
           res.send(err);
       }
    });
});
app.get('/api/user/:id/games/:gameid', function(req,res){
    NineboardUser.findById(req.params.id, function(err, person){
        if(!err){
            NineboardGame.find({'players':person.DeviceID},function(err, game){
                for(var i=0; i<game.length; i++){
                    if(game.gameID=req.params.gameid){
                        res.json(game);
                    }
                }
            });
        }
        else{
            res.send(err);
        }
    });
});
app.get('/api/user/:id/games/all', function(req,res){
    NineboardUser.findById(req.param.id, function(err, person){
        if(!err){
            NineboardGame.find({'players':person.DeviceID}, function(err, game){
                if(!err){
                    res.json(game);
                }
                else{
                    res.send(err);
                }
            });
        }
        else{
            res.send(err);
        }
    });
});
app.get('/api/user/:id/games/past', function(req,res){
    NineboardUser.findById(req.param.id, function(err, person){
        if(!err){
            NineboardGame.find({'players': person.DeviceID}, function(err, game){
                if(!err){
                    for(var i=0; i<game.length; i++){
                        if(game.gamestatus.ongoing=JSON.parse("Done")){
                            res.json(game);
                        }
                    }
                }
                else{
                    res.send(err);
                }
            });
        }
        else{
            res.send(err);
        }
    });
});
//dont get this one
app.post('/api/:id/games/:gameid', function(req, res){
    NineboardUser.findById(req.param.id, function(err){
        if(!err){
            NineboardGame.find(req.param.gameid, function(err,game){
               if(!err){
                   res.json(game);
                }
                else{
                    res.send(err);
                }
            });
        }
        else{
            res.send(err);
        }
    });
});
var server= app.listen(3000, function(){
    var host= server.address().address;
    var port= server.address().port;
    console.log("SERVER STARTED");
});
