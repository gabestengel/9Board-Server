function highScoreList(element) {
    //var allScores = get from routes
    var allScores = [{"username":"FacebookUser1","score":100},{"username":"FacebookUser2","score":50},{"username":"FacebookUser3","score":85}];
    allScores.sort(function(a,b) { return b.score - a.score});
    $(element).append('<table id = "scoreList"></table>');
        var newRow = $('<tr></tr>');
        newRow.append('<th></th>');
        newRow.append('<th>USERNAMES</th');
        newRow.append('<th>SCORE</th>');
        $("#scoreList").append(newRow);
    for (i = 0; i < allScores.length; i++){
        newRow = $('<tr></tr>');
        newRow.append('<td>' + (i+1) + '</td>');
        newRow.append('<td>' + allScores[i].username + '</td>');
        newRow.append('<td>' + allScores[i].score + '</td>');
        $("#scoreList").append(newRow);
    }
}