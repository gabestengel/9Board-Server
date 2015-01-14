function highScoreList(element) {
    //var allScores = get from routes
    var allScores = [{"username":"test1","score":10},{"username":"test2","score":8}];
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