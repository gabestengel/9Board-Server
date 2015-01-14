var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
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

//annoying schema stuff
var rowSchema = new Schema({
	column: [Number]
});
var NineboardRow= mongoose.model('NineBoardRow', rowSchema);
var smallBoardSchema   = new Schema({
	row: [{type: ObjectId, ref:rowSchema}]
});
var NineboardSmallBoard= mongoose.model('NineBoardSmallBoard', smallBoardSchema);
var gameStateSchema = new Schema({
	    currentPlayerMove: Number,
    	lastMove: {
	 	      board: Number,
        		row: Number,
        		column: Number
    	},
    	bigBoard: [{type: ObjectId, ref:smallBoardSchema}]  
});
var NineboardGameState= mongoose.model('NineboardGameState', gameStateSchema);



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
app.get('/api/user/:id/games2/active', function(req,res){
   NineboardGame.find({ players: { $in: [req.param('id')] }  }, function(err,game){
        if(!err){
            var games= new Array();
            for(var i=0; i<=game.length-1; i++){
                if(game[i].gameStatus.ongoing="Active"){
                    games.push(game[i]);
                }
            }
            res.json(games);
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

app.get('/api/user/:id/games2/all', function(req,res){
    
    NineboardGame.find( { players: { $in: [req.param('id')] }  }, function(err, game){
        if(!err){
            res.json(game);
        }
        else{
            res.send(err);
        }
    });
});

app.get('/api/user/:id/games2/past', function(req,res){
    NineboardGame.find({ players: { $in: [req.param('id')] }  }, function(err, game){
        if(!err){
            var games= new Array();
            for(var i=0; i<game.length; i++){
                if(game[i].gameStatus.ongoing="Done"){
                    games.push(game[i]);
                }
            }
            res.json(games);
        }
        else{
            res.send(err);
        }
    });
});

/* Plays a turn
// Parameters: 
// req.param.id: id of the user playing the turn
// req.body.turn: the actual turn that the user is playing, an integer, ie 322 means big board index 2, row being 3, and column being 3, first number is 0-8, second number is 0-2, third number is 0-2
// Returns: the new game state, complete with new board/current game state
// Work: update board, check for win, if so update stats, return ^
*/
app.post('/api/:id/games2/:gameId/:turn', function(req, res){
    NineboardGame.findById(req.params.gameId, function(err,game){
        if(!err){
            addTurn(game, req.params.turn, req.param.id, function(game){
                res.json(game);
            });
            //if(checkWin(game)){
                //game.gameStatus.ongoing="Done";
            //}
        }
        else{
            res.send(err);
        }
    });
});
/*Creates a game
//Parameters:
//req.param.id: id of the user playing the turn
//req.param.player2id: id of the other user
//Returns: The game created
*/
app.post('/api/:id/:player2id/games', function(req,res){
    
    var player1Id= req.param('id');
    var player2Id= req.param('player2id');
    var game= new NineboardGame();
    var gameState= new NineboardGameState();
    var player2;
    NineboardUser.findOne({facebookId:player2Id}, function(err, user){
        player2=user;
    });
    
    game.players= [player1Id, user.id];
    game.gameStatus.ongoing= 'Active';
    game.gameStatus.winner= 'null';
    
    makeBoard(function(board1){
        makeBoard(function(board2){
            makeBoard(function(board3){
                gameState.bigBoard= board1.concat(board2.concat(board3));
                gameState.save(function(err,savedGameState){
                    game.gameStates= [savedGameState.id];
                    game.save(function(err, savedGame){
                        if(!err){
                            res.json(savedGame);
                        }
                        else{
                            res.send(err);
                        }
                    });
                });
            });
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

//function for checking win
function checkWin(game){
    var gamestate= game.gameStates[game.gameStates.length-1];
    var board= gamestate.bigBoard[gamestate.lastMove.board];
    if(board.row[0].column[gamestate.lastMove.column]==board.row[1].column[gamestate.lastMove.column] && board.row[1].column[gamestate.lastMove.column]==board.row[2].column[gamestate.lastMove.column]){
        return true;
    }
    else if(board.row[gamestate.lastMove.row].column[0]==board.row[gamestate.lastMove.row].column[1] && board.row[gamestate.lastMove.row].column[0]==board.row[gamestate.lastMove.row].column[2]){
        return true;
    }
    else if(board.row[0].column[0]==board.row[1].column[1] && board.row[0].column[0]==board.row[2].column[2]){
        return true;
    }
    else if(board.row[2].column[0]==board.row[1].column[1] && board.row[2].column[0]==board.row[0].column[2]){
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
        if(game.players[0]=id){
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
}