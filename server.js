var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var apn= require('apn');
mongoose.connect('mongodb://localhost:27017/9board');

// all environments
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));
var multer= require('multer');
var bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(multer());

var NineboardUser = require('./models/user.js');
var NineboardGame = require('./models/game.js');
var ObjectId= mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//apn stuff
var options= { };
var apnConnection= new apn.Connection(options);



// request logging
app.use(function(req, res, next) {
	console.log("----------");
	console.log("request: " + req.path + ", protocol: " + req.protocol);
	next();
});

// error logging
app.use(function(err, req, res, next) {
	console.log("ERROR: " + err + ".. for path: " + req.path);
	next();
})

// landing page
app.get("/", function(req, res) {
	console.log("GET landing page");
	res.json({"success": true});
});

/* Creates a new user in the server, when someone logs into the app for the first time
// EDIT-- The app doesn't know whether the user is a new user, so this route is called *every time a user logs in*. If a user with the facebook id already exists, it returns the id of the user and that's it, otherwise it creates a new user.
// Parameters:
// req.body.facebookId: the facebook id for the user
// req.body.deviceId: the device id for the user
// req.body.name: name of the user
// Returns: id of the user
// Work: insert new user into database
*/
app.post('/api/user', function(req, res){
	var facebookId = req.body.facebookId;
	NineboardUser.findOne({facebookId: facebookId}, function(err, user) {
		if (err) {
			console.log("error: " + err);
			res.send(err);
		}
		else if (user) {
			console.log("user already exists: " + user.id);
			res.json({"userId": user.id});
		}
		else {
			console.log("no user exists, creating new");
			var deviceId = req.body.deviceId;
		    var name = req.body.name;
		    var user = new NineboardUser();
		    user.name = name;
		    user.deviceId = deviceId;
		    user.facebookId = facebookId;
		    user.save(function(err, savedUser) {
		        if(!err){
					console.log("new user id: " + savedUser.id);
                    savedUser.stats.cumulativeScore= 1400;
		            res.json({"userId": savedUser.id});
		        }
		        else {
					console.log("error saving user: " + err);
		            res.json(err);
		        }
		    });
		}
	});
});

/* later */
app.get('/api/user/:id/stats', function(req,res){
    NineboardUser.findById(req.params.id, function(err, person){
        if(!err){
            res.json(person.stats);
        }
        else{
			console.log("error getting stats: " + err);
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
//app.get('/api/user/:id/games2/active', function(req,res){
//   NineboardGame.find({ playerIds: { $in: [req.param('id')] }  }, function(err,game){
//        if(!err){
//            var games= new Array();
//            for(var i=0; i<=game.length-1; i++){
//                if(game[i].gameStatus.ongoing="Active"){
//                    games.push(game[i]);
//                }
//            }
//            res.json(games);
//        }
//        else{
//            res.send(err);
//        }
//    });
//});

/* 
// Parameters:
// req.params.id: the user id
// req.params.gameId: id of the the game we are looking for
// Returns: game board
// Work: none
*/
app.get('/api/user/:id/games/:gameId', function(req,res){
    NineboardGame.findById(req.params.gameId,function(err, game){
        if(!err){
        }
        else{
            res.send(err);
        }

    });
});

// all games

app.get('/api/user/:id/games2/all', function(req,res){
    
    NineboardGame.find( { playerIds: { $in: [req.param('id')] }  }, function(err, game){
        if(!err){
            res.json(game);
        }
        else{
            res.send(err);
        }
    });
});

//app.get('/api/user/:id/games2/past', function(req,res){
//    NineboardGame.find({ players: { $in: [req.param('id')] }  }, function(err, game){
//        if(!err){
//            var games= new Array();
//            for(var i=0; i<game.length; i++){
//                if(game[i].gameStatus.ongoing="Done"){
//                    games.push(game[i]);
//                }
//            }
//            res.json(games);
//        }
//        else{
//            res.send(err);
//        }
//    });
//});

/* Plays a turn
// Parameters: 
// req.param.id: id of the user playing the turn
// req.body.turn:
// Returns: the new game state, complete with new board/current game state
// Work: update board, check for win, if so update stats, return ^
*/
app.post('/api/:id/game/:gameId/turn', function(req, res){
	var userId = req.param('id');
	var gameId = req.param('gameId');
	var turnBigBoardPosition = req.body.big_board_position;
	var turnSmallBoardPosition = req.body.small_board_position;
	
	console.log(userId + "--" + gameId);
	
    NineboardGame.findById(gameId, function(err,game) {
		if(!err && game){
			
			var numeralRepresentingPlayerTurn = 2;
			if (game.playerIds[0] == userId) {
				numeralRepresentingPlayerTurn = 1;
			}
			game.fullBoard[turnBigBoardPosition][turnSmallBoardPosition] = numeralRepresentingPlayerTurn;
			
			game.lastMove.bigBoardPosition = turnBigBoardPosition;
			game.lastMove.smallBoardPosition = turnSmallBoardPosition;
			
			if (game.currentTurnId == game.playerIds[0]) {
				game.currentTurnId = game.playerIds[1];
			}
			else {
				game.currentTurnId = game.playerIds[0];
			}
			console.log("game: " + game);
			game.markModified('fullBoard');
			
			if (userDidWin(game)) {
                var user;
				console.log("user won!!!");
				game.active = false;
				game.winner = userId;
				
				NineboardUser.findById(userId, function(err, user){
                    user.stats.winsNumber= user.stats.winsNumber+1;
                    NineboardUser.findById(game.players[0], function(err,user2){
                        if(userId!=user2.id){
                            user2.stats.losses= user2.stats.losses+1;
                            if(user2.stats.cumulativeScore<user.stats.cumulativeScore){
                                user.stats.cumulativeScore= user.stats.cumulativeScore+((user2.stats.cumulativeScore/user.stats.cumulativeScore)*100);
                                user2.stats.cumulativeScore= user2.stats.cumulativeScore-((user.stats.cumulativeScore/user2.stats.cumulativeScore)*50);
                            }
                            else{
                                user2.stats.cumulativeScore= user.stats.cumulativeScore-((user2.stats.cumulativeScore/user.stats.cumulativeScore)*100);
                                user.stats.cumulativeScore= user2.stats.cumulativeScore+((user.stats.cumulativeScore/user2.stats.cumulativeScore)*50);
                            }
                        }
                    });
                    NineboardUser.findById(game.players[1], function(err,user2){
                        if(userId!=user2.id){
                            user2.stats.losses= user2.stats.losses+1;
                            if(user2.stats.cumulativeScore<user.stats.cumulativeScore){
                                user.stats.cumulativeScore= user.stats.cumulativeScore+((user2.stats.cumulativeScore/user.stats.cumulativeScore)*100);
                                user2.stats.cumulativeScore= user2.stats.cumulativeScore-((user.stats.cumulativeScore/user2.stats.cumulativeScore)*50);
                            }
                            else{
                                user2.stats.cumulativeScore= user.stats.cumulativeScore-((user2.stats.cumulativeScore/user.stats.cumulativeScore)*100);
                                user.stats.cumulativeScore= user2.stats.cumulativeScore+((user.stats.cumulativeScore/user2.stats.cumulativeScore)*50);
                            }
                        }
                    });
                    this.user=user;
                });
                
				
				
				game.save(function(err, savedGame) {
					if (err) {
						res.send(err);
						console.log(err);
					}
					else {
						res.json(savedGame);
						console.log("savedgame: " + savedGame);
					}
                    //notification
                    var myDevice= new apn.Device(token);
                    var note= new apn.Notification();
                    note.badge= 1;
                    note.sound= "ping.aiff";
                    note.alert = "\iD83D\uDCE7 \u2709 "+user.name+" has won";
                    
                    apnConnection.pushNotification(note, myDevice);
					return;
				});
			}
			else {
				game.save(function(err, savedGame) {
					if (err) {
						res.send(err);
						console.log(err);
					}
					else {
						res.json(savedGame);
						console.log("savedgame: " + game);
					}
                    //notification
                    var myDevice= new apn.Device(token);
                    var note= new apn.Notification();
                    note.badge= 1;
                    note.sound= "ping.aiff";
                    note.alert = "\iD83D\uDCE7 \u2709 "+user.name+" has moved";
                    
                    apnConnection.pushNotification(note, myDevice);
				});
			} 
			
			
            //if(checkWin(game)){
                //game.gameStatus.ongoing="Done";
            //}
        }
        else {
            res.send(err);
			console.log(err);
        }
    });
});
/*Creates a game
//Parameters:
//req.param.id: id of the user playing the turn
//req.param.player2id: id of the other user
//Returns: The game created
*/
app.post('/api/:id/:player2fbid/games', function(req,res){
    
    var player1Id= req.param('id');
    var player2FbId= req.param('player2fbid');
    var game= new NineboardGame();
    
    NineboardUser.findOne({facebookId: player2FbId}, function(err, user) {
		if (err) {
			res.json(err);
			console.log("error finding user: " + err);
		}
        var player2Id = "gabe.stengel"; //user.id;
		
		game.playerIds= [player1Id, player2Id];
		game.currentTurnId = player1Id;

		var fullBoardArray = new Array();
		for (var j = 0; j < 9; j++) {
			var smallBoardArray = new Array();
			for (var k = 0; k < 9; k++) {
				smallBoardArray[k] = 0;
			}
			fullBoardArray[j] = smallBoardArray;
		}
	 	game.fullBoard = fullBoardArray;  
	 
		game.save(function(err, savedGame){
	    	if (!err){
				res.json(savedGame);
                //notification
                var myDevice= new apn.Device(token);
                var note= new apn.Notification();
                note.badge= 1;
                note.sound= "ping.aiff";
                note.alert = "\iD83D\uDCE7 \u2709 "+user.name+" has created a game against you";

                apnConnection.pushNotification(note, myDevice);
			}
			else {
				console.log("error creating game: " + err);
				res.send(err);
			}
            
	    });
    });
    
    
});

/* Leaderboard
// Paramters: none
// Returns: leaderboard data, an array of all users with their statistics, sorted from highest to lowest
*/
app.get("/api/leaderboard", function(req,res){
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

function userDidWin(game) {
	for (var i = 0; i < 9; i++) {
		var grid = game.fullBoard[i];
		// horizontal
		if (grid[0] == grid[1] && grid[1] == grid[2] && grid[2] != 0) {
			console.log("win1");
			return true;
		}
		if (grid[3] == grid[4] && grid[4] == grid[5] && grid[5] != 0) {
			console.log("win2");
			return true;
		}
		if (grid[6] == grid[7] && grid[7] == grid[8] && grid[8] != 0) {
			console.log("win3");
			return true;
		}
		// vertical
		if (grid[0] == grid[3] && grid[3] == grid[6] && grid[6] != 0) {
			console.log("win4");
			return true;
		}
		if (grid[1] == grid[4] && grid[4] == grid[7] && grid[7] != 0) {
			console.log("win5");
			return true;
		}
		if (grid[2] == grid[5] && grid[5] == grid[8] && grid[8] != 0) {
			console.log("win6");
			return true;
		}
		// didagonal
		if (grid[0] == grid[4] && grid[4] == grid[8] && grid[8] != 0) {
			console.log("win7");
			return true;
		}
		if (grid[2] == grid[4] && grid[4] == grid[6] && grid[6] != 0) {
			console.log("win8");
			return true;
		}
	}
	return false;
}

//function for checking win
function checkWin(game){
    var lastBoardPlayed= game.fullBoard[game.lastMove.bigBoardPosition];
    if(lastBoardPlayed[0]==lastBoardPlayed[5] && lastBoardPlayed[4]==lastBoardPlayed[8]){
        return true;
    }
    else if(lastBoardPlayed[game.lastMove.smallBoardPosition%3]==lastBoardPlayed[(game.lastMove.smallBoardPosition%3)+3] && lastBoardPlayed[game.lastMove.smallBoardPosition%3]==lastBoardPlayed[(game.lastMove.smallBoardPosition%3)+6]){
        return true;
    }
    else if(lastBoardPlayed[0]==lastBoardPlayed[1]&&lastBoardPlayed[1]==lastBoardPlayed[2]){
        return true;
    }
    else if(lastBoardPlayed[3]==lastBoardPlayed[4]&&lastBoardPlayed[4]==lastBoardPlayed[5]){
        return true;
    }
    else if(lastBoardPlayed[6]==lastBoardPlayed[7]&&lastBoardPlayed[7]==lastBoardPlayed[8]){
        return true;
    }
    else if(lastBoardPlayed[2]==lastBoardPlayed[4]&&lastBoardPlayed[4]==lastBoardPlayed[8]){
        return true;
    }
    else{
        return false;
    }
}

//add a turn
function addTurn(game, recentTurn, id, callbackFunction){
    var player=0;
    var smallBoardIndex= Math.floor(recentTurn/100);
    var rowIndex= Math.floor((recentTurn/10)%10);
    var columnIndex= Math.floor(recentTurn%10);
    console.log(game.gameStates[game.gameStates.length-1]);
    NineboardGameState.findById(game.gameStates[game.gameStates.length-1], function(err, gameState){
        if(!err){
        if(game.playerIds[0]=id){
            player=1;
            //gameState.currentPlayerMove=game.players[1];
        }
        else{
            player=2;
            //gameState.currentPlayerMove=game.players[0];
        }
        console.log(gameState.bigBoard[smallBoardIndex]);
        NineboardSmallBoard.findById(gameState.bigBoard[smallBoardIndex], function(err, smallBoard){
            NineboardRow.findById(smallBoard.row[rowIndex], function(err, row2){
                var row= new NineboardRow();
                for(var i=0; i<3; i++){
                    row.column[i]= row2.column[i];
                }
                row.column[columnIndex]= player;
                row.save(function(err, savedRow){
                    var biggieSmallBoard= new NineboardSmallBoard();
                    for(var i=0; i<smallBoard.row.length; i++){
                        biggieSmallBoard.row[i]= smallBoard.row[i];
                    }
                    biggieSmallBoard.row[rowIndex]= savedRow.id;
                    biggieSmallBoard.save(function(err,savedBoard){
                        var gameStateNew= new NineboardGameState();
                        if(player==1){
                            gameStateNew.currentPlayerMove=game.players[1];
                        }
                        else{
                            gameStateNew.currentPlayerMove=game.players[0];
                        }
                        for(var i=0; i<gameState.bigBoard.length;i++){
                            gameStateNew.bigBoard[i]=gameState.bigBoard[i];
                        }
                        gameStateNew.bigBoard[smallBoardIndex]= savedBoard.id;
                        gameStateNew.lastMove.board= smallBoardIndex;
                        gameStateNew.lastMove.row= rowIndex;
                        gameStateNew.lastMove.column=columnIndex;
                        gameStateNew.save(function(err, savedGameState){
                            console.log(savedGameState.id);
                            game.gameStates.push(savedGameState.id);
                            game.save(function(err, savedGame){
                                callbackFunction(savedGame);
                                if(err){
                                    res.send(err);
                                }
                            });
                        });
                    });
                });
            });
        });
        }
        else{
            res.send(err);
        }
    });
    
    /*
    gameState.bigBoard[smallBoardIndex].row[rowIndex].column[columnIndex]=player;
    gameState.lastMove.board= smallBoardIndex;
    gameState.lastMove.row= rowIndex;
    gameState.lastMove.column=columnIndex;
    game.gameStates.push(gameState);'
    */
}
function makeBoard(callBackFunction){
    var row1= new NineboardRow();
    var row2= new NineboardRow();
    var row3= new NineboardRow();
    var row4= new NineboardRow();
    var row5= new NineboardRow();
    var row6= new NineboardRow();
    var row7= new NineboardRow();
    var row8= new NineboardRow();
    var row9= new NineboardRow();
    var row1Id, row2Id, row3Id, row4Id, row5Id, row6Id, row7Id, row8Id, row9Id;
    var smallBoard1= new NineboardSmallBoard();
    var smallBoard2= new NineboardSmallBoard();
    var smallBoard3= new NineboardSmallBoard();
    var game= new NineboardGame();
    var gameStates= new NineboardGameState();
    
    //first chunk
    row1.column= [0,0,0];
    row1.save(function(err, savedRow){
        if(!err){
            row1Id= savedRow.id;
        }
        row2.column= [0,0,0];
        row2.save(function(err, savedRow){
            if(!err){
                row2Id= savedRow.id;
            }
            row3.column= [0,0,0];
            row3.save(function(err, savedRow){
                if(!err){
                    row3Id= savedRow.id;
                }
                    row4.column= [0,0,0];
                    row4.save(function(err, savedRow){
                        if(!err){
                            row4Id= savedRow.id;
                        }
                        row5.column= [0,0,0];
                        row5.save(function(err, savedRow){
                            if(!err){
                                row5Id= savedRow.id;
                            }
                            row6.column= [0,0,0];
                            row6.save(function(err, savedRow){
                                if(!err){
                                    row6Id= savedRow.id;
                                }
                                row7.column= [0,0,0];
                                row7.save(function(err, savedRow){
                                    if(!err){
                                        row7Id= savedRow.id;
                                    }
                                    row8.column= [0,0,0];
                                    row8.save(function(err, savedRow){
                                        if(!err){
                                            row8Id= savedRow.id;
                                        }
                                        row9.column= [0,0,0];
                                        row9.save(function(err, savedRow){
                                            if(!err){
                                                row9Id= savedRow.id;
                                            }
                                            smallBoard1.row= [row1Id, row2Id, row3Id];
                                            smallBoard1.save(function(err, savedBoard){
                                                if(!err){
                                                    smallBoard1Id= savedBoard.id;
                                                }
                                                smallBoard2.row= [row4Id, row5Id, row6Id];
                                                smallBoard2.save(function(err, savedBoard){
                                                    if(!err){
                                                        smallBoard2Id= savedBoard.id;
                                                    }
                                                    smallBoard3.row= [row7Id, row8Id, row9Id];
                                                    smallBoard3.save(function(err, savedBoard){
                                                        if(!err){
                                                            smallBoard3Id= savedBoard.id;
                                                        }
                                                        var someArray= [smallBoard1Id, smallBoard2Id, smallBoard3Id];
                                                        callBackFunction(someArray);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }); 
            });
        });
    });
    
    
}

function formFullBoard(game, dontcallmeMaybe){
    var returnArray = new Array(new Array( new Array()));
    NineboardGameState.findById(game.gameStates[game.gameStates.length-1], function(err, gameState){
        for(var i=0; i<9; i++){
            NineboardSmallBoard.findById(gameState.bigBoard[i], function(err, smallBoard){
                for(var j=0; j<3; i++){
                    NineboardRow.findById(smallBoard.row[i], function(err, row){
                        returnArray[i][j].push(row);
                    });
                }
            });
        }
    });
    var waiting= true;
    while(waiting){
        if(returnArray[8][2][2]!=null){
            waiting= false;
            return returnArray;
        }
    }
}
