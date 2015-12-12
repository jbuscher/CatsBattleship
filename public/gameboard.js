    (function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;
    var timeLeft;
    var thisTeam;
    var turnLength;

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS, "teamBoard");
        buildGameBoard(ROWS, COLS, "enemyBoard");
        $("#enemyBoard").show();
        $("#teamBoard").hide();

        connection.getTeam(function(team) {
            $("#team_name").html("Team " + team);
            thisTeam = team;
        });

        //Click handler for cells
        for(var i = 1; i <= ROWS*COLS; i++) {
            $("#" + i + "enemyBoard").click(function() {
                connection.postVote(this.id);
                // $("#vote").html(parseInt(this.id));
                // var elem = $("#" + i + "enemyBoard");
                // elem.style.border="3px solid green";
                // setTimeout(revertBorderColor(elem), timeLeft*1000);
            });
        }
 
        //change which board is being looked at.
        $('input:radio[name=boardChoice]').change(changeRadioButton);

        //get board state
        connection.getBoardState(updateBoardStateFunction);
    });

    // hit = 8, 6, 4, 2, 0
    // miss = 12
    var updateBoardStateFunction = function(boardState) {
        var boards = JSON.parse(boardState);
        var boards2 = boards.slice();
        boards2 = boards2.splice(100, 100);

        var sunk2 = containsElementNtimes(boards2, 8, 2);
        var sunk3a = containsElementNtimes(boards2, 6, 3);
        var sunk3b = containsElementNtimes(boards2, 4, 3);
        var sunk4 = containsElementNtimes(boards2, 2, 4);
        var sunk5 = containsElementNtimes(boards2, 0, 5);

        for(var i = 1; i <= ROWS*COLS; i++) {
            var state = boards[i+99];
            //$("#" + i + "enemyBoard").html(state);
            var td = $("#" + i + "enemyBoard")[0];
            td.className = "sea";
            if (state == 12) {
                td.className = "miss";
            } else if (state % 2 == 0) {
                td.className = "hit";
                if (sunk2 && state == 8) {
                    td.className = "pointer2";
                }

                if (sunk3a && state == 6) {
                    td.className = "pointer3a";
                }

                if (sunk3b && state == 4) {
                    td.className = "pointer3b";
                }

                if (sunk4 && state == 2) {
                    td.className = "pointer4";
                }

                if (sunk5 && state == 0) {
                    td.className = "pointer5";
                }
            }
        }

        for (var i = 1; i <= ROWS*COLS; i++) {
            var state = boards[i-1];
            $("#" + i + "teamBoard").html(state);
            var td = $("#" + i + "teamBoard")[0];
            if (state == 9) {
                td.className = "pointer2";
            } else if (state == 7){
                td.className = "pointer3a";
            } else if (state == 5){
                td.className = "pointer3b";
            } else if (state == 3){
                td.className = "pointer4";
            } else if (state == 1){
                td.className = "pointer5";
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

    function containsElementNtimes(boards, x, n) {
        var count = 0;
        for (var i = 0; i < ROWS*COLS; i++) {
            if (boards[i] == x) {
                count++;
            }
        }

        return (count == n);
    }

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

    // function revertBorderColor(elem) {
    //     elem.style.border="3px solid black";
    // }

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


   function gameover(winner) {

   }


    var socket = io();
    //Handle Timer
    socket.on('timer', function (data) {  
        $('#timer').html(data);
    });

    //Handle game state
    socket.on('gameState', function(data) {
        console.log(data);
        $("#turn_marker").html(data.turn);
        var x = data.location % 10
        var y = Math.floor(data.location / 10);

        if(thisTeam == data.turn) { //enemy shot
            $("#e_x").html(x);
            $("#e_y").html(y);
        } else {
            $("#x").html(x);
            $("#y").html(y);
        }
        
        if(data.gameover > 0) {
            gameover(data.gameover);
        }
    });

})();