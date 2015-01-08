var express = require('express');
var app = express();
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
var NineboardUser = require('./models/user.js');
var NineboardGame = require('./models/game.js');
var NineboardGameState = require('./models/game-state.js');

/* Creates a new user in the server, when someone logs into the app for the first time
// Parameters:
// req.body.facebookId: the facebook id for the user
// req.body.deviceId: the device id for the user
// req.body.name: name of the user
// Returns: id of the user
// Work: insert new user into database
*/
app.post('/api/user', function(req, res){
    var facebookId= req.body.facebookId;
    var deviceId= req.body.deviceId;
    var name= req.body.name;
    var user= new NineboardUser();
    user.name= name;
    user.deviceId= deviceId;
    user.facebookId= facebookId;
    user.save(function(err,savedUser){
        if(!err){
            res.send(savedUser.id);
        }
        else {
            res.send(err);
        }
    });
});

/* later */
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

/* Gives client list of games
// Paramters:
// req.params.id: id of the user
// Returns: full data about all games of the user that are active
// Work: none
*/
app.get('/api/user/:id/games/active', function(req,res){
    NineboardUser.findById(req.params.id,function(err, person){
       if(!err){
           NineboardGame.find({'players':person.DeviceID}, function(err,game){
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

/* 
// Parameters:
// req.params.id: the user id
// req.params.gameId: id of the the game we are looking for
// Returns: all data about a particular game
// Work: none
*/
app.get('/api/user/:id/games/:gameId', function(req,res){
    NineboardUser.findById(req.params.id, function(err, person){
        if(!err){
            NineboardGame.find({'players':id},function(err, game){
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
            NineboardGame.find({'players':id}, function(err, game){
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
            NineboardGame.find({'players': id}, function(err, game){
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

/* Plays a turn
// Parameters: 
// req.param.id: id of the user playing the turn
// req.body.turn: the actual turn that the user is playing, an integer, ie 75 means big board index 7, small board index 5
// Returns: the new game state, complete with new board/current game state
// Work: update board, check for win, if so update stats, return ^
*/
app.post('/api/:id/games/:gameid', function(req, res){
    var hasBeenCreated= false;
    NineboardGame.findById(req.param.gameid, function(err,game){
        if(!err){
            addTurn(game,req.body.turn);
            checkWin(game, req.body.turn);
            res.json(game);
        }
        else{
            res.send(err);
        }
    });
});
/*Creates a game
//Parameters:
//req.param.id: id of the user playing the turn
//req.body.id: id of the other user
//Returns: The game created
*/
app.post('/api/:id/games', function(err,res){
    var player1Id= req.param.id;
    var player2Id= req.body.id;
    var game= new NineboardGame;
    game.players= [player1Id, player2Id];
    game.Status= ["Active", ""];
    var gameStates= new NineboardGameState();
    gameState.currentPlayerMove=1;
    gameState.lastMove= [null, null];
    var smallBoard1= new smallBoardSchema();
    smallBoard1.board=[0,0,0,0,0,0,0,0,0];
    var bigBoard1= new nineBoardSchema();
    bigBoard1.smallBoard=[smallBoard1,smallBoard1,smallBoard1,smallBoard1,smallBoard1,smallBoard1,smallBoard1,smallBoard1,smallBoard1];
    gameState.bigBoard= [bigBoard1];
    game.gameStates=[gameStates];
    game.save(function(err,savedGame){
        if(!err){
            res.json(savedGame);
        }
        else{
            res.send(err);
        }
    });
});

/* Leaderboard
// Paramters: none
// Returns: leaderboard data, an array of all users with their statistics, sorted from highest to lowest
*/
app.get("/api/leaderboard", function(err,res){
    NineboardUser.find(function(err,users){
        if(!err){
            users.sort(function(a,b){
                return b.wins-a.wins;
            });
            res.send(users);
        }
        else{
            res.send(err);
        }
    });
});
var server= app.listen(3000, function(){
    var host= server.address().address;
    var port= server.address().port;
    console.log("SERVER STARTED at http://%s:%s",host,port);
});

//function for checking win
function checkWin(game, recentTurn){
    var bigBoardIndex= (recentTurn/10)%10;
    var smallBoardIndex= recentTurn%10;
    var gameStates= game.gameStates;
    var currBoard= gameStates[gameStates.length-1];
    var bigBoard= currBoard.bigBoard[bigBoardIndex];
    var smallBoard= bigBoard.smallBoard[smallBoardIndex];
    
}
