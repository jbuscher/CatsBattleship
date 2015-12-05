(function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS, "teamBoard");
        buildGameBoard(ROWS, COLS, "enemyBoard");
        $("#enemyBoard").show();
        $("#teamBoard").hide();

        connection.getTeam(function(team) {
            $("#team_name").html("Team " + team);
        });


        //Click handler for cells
        for(var i = 1; i <= ROWS*COLS; i++) {
            $("#" + i + "enemyBoard").click(function() {
                connection.postVote(this.id);
            });
        }

        //change which board is being looked at.
        $('input:radio[name=boardChoice]').change(changeRadioButton);

        //get board state
        connection.getBoardState(function(boardState) {
            var board = JSON.parse(boardState);
            for(var i = 0; i <= board.length; i++) {
                $("#" + i + "enemyBoard").html(board[i-1]);
            }
        })
    });

    function buildGameBoard(rows, cols, divName) {
        var tableDiv = $("#" + divName);
        var count = 1;
        var htmlString = "";
        htmlString += "<table>";
        for(var i = 0; i < rows; i++) {
            htmlString += "<tr>";
            for(var j = 0; j < cols; j++) {
                htmlString += "<td id=\"" + count + divName + "\" class=\"" + divName + "Class\"></td>";
                count++;
            }
            htmlString += "</tr>";
        }
        htmlString += "</table>";
        tableDiv.append(htmlString);
    }

    function changeRadioButton() {
        if ($("input[name='boardChoice']:checked").val() == 'teamBoardButton') {
            $("#teamBoard").show();
            $("#enemyBoard").hide();
        }
        if ($("input[name='boardChoice']:checked").val() == 'enemyBoardButton') {
            $("#teamBoard").hide();
            $("#enemyBoard").show();
        }
    }

})();