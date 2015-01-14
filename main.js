$(document).ready(function(){
    $('#highScoresButton').on('click', function(){
        $('#highScores').empty();
        $('#buttons').empty();
        highScoreList('#highScores');
        $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
        $('#back').on('click', function(){
            $('#buttons').empty();
            $('#search').empty();
            $('#highScores').empty();
            $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
            $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
            
            $('#highScoresButton').on('click', function(){
                $('#highScores').empty();
                $('#buttons').empty();
                highScoreList('#highScores');
                $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
                $('#back').on('click', function(){
                    $('#buttons').empty();
                    $('#search').empty();
                    $('#highScores').empty();
                    $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
                    $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
            
                });
            });
            
            $('#searchButton').on('click', function(){
                $('#buttons').empty();
                $('#highScores').empty();
                $("#search").append('<p><label for = "searchBox" id = "searchLabel">SEARCH USERS </label><input type = "text" id = "searchBox" name = "searchBox"></input><button id = "searchButtonBox">SEARCH!</button></p>');
                $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
                $('#searchButtonBox').on('click', function(){
                    search();
                });
        
        
                $('#back').on('click', function(){
                    $('#buttons').empty();
                    $('#search').empty();
                    $('#highScores').empty();
                    $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
                    $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
                });
            });
        });
    });
    
    $('#searchButton').on('click', function(){
        $('#buttons').empty();
        $('#highScores').empty();
        $("#search").append('<p><label for = "searchBox" id = "searchLabel">SEARCH USERS </label><input type = "text" id = "searchBox" name = "searchBox"></input><button id = "searchButtonBox">SEARCH!</button></p>');
        $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
        $('#searchButtonBox').on('click', function(){
            search();
        });
        
        
        $('#back').on('click', function(){
            $('#buttons').empty();
            $('#search').empty();
            $('#highScores').empty();
            $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
            $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
            
            $('#highScoresButton').on('click', function(){
                $('#highScores').empty();
                $('#buttons').empty();
                highScoreList('#highScores');
                $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
                $('#back').on('click', function(){
                    $('#buttons').empty();
                    $('#search').empty();
                    $('#highScores').empty();
                    $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
                    $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
            
                });
            });
            
            $('#searchButton').on('click', function(){
                $('#buttons').empty();
                $('#highScores').empty();
                $("#search").append('<p><label for = "searchBox" id = "searchLabel">SEARCH USERS </label><input type = "text" id = "searchBox" name = "searchBox"></input><button id = "searchButtonBox">SEARCH!</button></p>');
                $('#buttons').append('<button id = "back" name = "back">BACK</button>');
        
                $('#searchButtonBox').on('click', function(){
                    search();
                });
        
        
                $('#back').on('click', function(){
                    $('#buttons').empty();
                    $('#search').empty();
                    $('#highScores').empty();
                    $('#buttons').append('<button id = "searchButton" name = "search">Search Users</button>');
                    $('#buttons').append('<button id = "highScoresButton" name = "hScores">High Score List</button>');
                });
            });
        });
    });
    
});