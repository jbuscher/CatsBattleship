    (function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;
    var timeLeft;
    var whosTurn;
    var turnLength;

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS, "teamBoard");
        buildGameBoard(ROWS, COLS, "enemyBoard");
        $("#enemyBoard").show();
        $("#teamBoard").hide();

        connection.getTeam(function(team) {
            $("#team_name").html("Team " + team);
        });

        connection.getGameInfo(function(data) {
            var info = data.split(",");
            whosTurn = info[0]
            $("#turn_marker").html(whosTurn);
            timeLeft = info[1];
            turnLength = info[2];
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
        connection.getBoardState(updateBoardStateFunction);
    });

    // hit = 8, 6, 4, 2, 0
        // miss = 12
        // 
    var updateBoardStateFunction = function(boardState) {
        var boards = JSON.parse(boardState);
        for(var i = 1; i <= ROWS*COLS; i++) {
            var state = boards[i+99];
            //$("#" + i + "enemyBoard").html(state);
            var td = $("#" + i + "enemyBoard")[0];
            td.className = "sea";
            if (state == 12) {
                td.className = "miss";
            } else if (state % 2 == 0) {
                td.className = "hit";
            }
        }

        for(var i = 1; i <= ROWS*COLS; i++) {
            var state = boards[i-1];
            $("#" + i + "teamBoard").html(state);
            var td = $("#" + i + "teamBoard")[0];
            if(state % 2 == 1 && state != 13) {
                //ship
                td.className = "ship";
            } else {
                td.className = "sea";
            }
            if (state == 12) {
                td.className = "miss";
            } else if (state % 2 == 0) {
                td.className = "hit";
            }
        }
    };

    function buildGameBoard(rows, cols, divName) {
        var tableDiv = $("#" + divName);
        var count = 1;
        var htmlString = "";
        htmlString += "<table id=\"boardTable\">";
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


    setInterval(function(){ 
        timeLeft--;
        $("#timer").html(timeLeft); 
        if(timeLeft == 0) {
            timeLeft = turnLength;
            whosTurn = whosTurn % 2 + 1;
            $("#turn_marker").html(whosTurn);
            connection.getBoardState(updateBoardStateFunction);
        }
    }, 1000);

})();