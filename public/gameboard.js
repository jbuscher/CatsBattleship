    (function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;
    var timeLeft;
    var thisTeam;
    var turnLength;
    var socket = io();

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS, "teamBoard");
        buildGameBoard(ROWS, COLS, "enemyBoard");
        $("#enemyBoard").show();
        $("#teamBoard").hide();

        connection.getTeam(function(team) {
            thisTeam = team;
        });

        //Click handler for cells
        for(var i = 1; i <= ROWS*COLS; i++) {
            $("#" + i + "enemyBoard").click(function() {
                if(this.className.split(" ")[0] == "sea")
                    socket.emit('vote', {team:thisTeam, location:parseInt(this.id)-1});
                //connection.postVote(this.id);
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
            var type = " enemy";
            td.className = "sea" + type;
            if (state == 12) {
                td.className = "miss" + type;
            } else if (state % 2 == 0) {
                td.className = "hit" + type;
                if (sunk2 && state == 8) {
                    td.className = "pointer2" + type;
                }

                if (sunk3a && state == 6) {
                    td.className = "pointer3a" + type;
                }

                if (sunk3b && state == 4) {
                    td.className = "pointer3b" + type;
                }

                if (sunk4 && state == 2) {
                    td.className = "pointer4" + type;
                }

                if (sunk5 && state == 0) {
                    td.className = "pointer5" + type;
                }
            }
        }
        type = " team";
        for (var i = 1; i <= ROWS*COLS; i++) {
            var state = boards[i-1];
    //        $("#" + i + "teamBoard").html(state);
            var td = $("#" + i + "teamBoard")[0];
            if (state == 9) {
                td.className = "pointer2" + type;
            } else if (state == 7){
                td.className = "pointer3a" + type;
            } else if (state == 5){
                td.className = "pointer3b" + type;
            } else if (state == 3){
                td.className = "pointer4" + type;
            } else if (state == 1){
                td.className = "pointer5" + type;
            } else {
                td.className = "sea" + type;
            }
            if (state == 12) {
                td.className = "miss" + type;
            } else if (state % 2 == 0) {
                td.className = "hit" + type;
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
        htmlString += "<tr>";
        for (var nums = 0; nums < cols + 1; nums++) {
            var displayString = (nums == 0) ? '': nums;
            htmlString += "<td class='dummy'>" + displayString + "</td>";
        }
        htmlString += "</tr>";
        for(var i = 0; i < rows; i++) {
            htmlString += "<tr>";
            htmlString += "<td class='dummy'>" + String.fromCharCode(65 + i);  + "</td>"
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
        if(thisTeam == winner) {
            alert("Your team wins!!!")
        } else {
            alert("Your team loses!!!")
        }
    }

    function clearVotes() {
        var tds = $(".enemy");
        for(var i = 0; i < tds.length; i++) {
            tds[i].innerHTML = "0";
        }   
    }


    socket.on('message', function(message) {
        var turn_text = message.turn == thisTeam ? "Your" : "Enemy";
        $("#turn_marker").html(turn_text);

        var tds = $(".enemy");
        for(var i = 0; i < tds.length; i++) {
            tds[i].innerHTML = message.votes[i];
        }  
    })

    //Handle Timer
    socket.on('timer', function (data) {  
        $('#timer').html(data);
    });

    socket.on('indyVote', function(data) {
        var loc = data.location;
        var count = data.voteCount;
        if(data.team == thisTeam)
            $("#" + (loc+1) + "enemyBoard").html("" + count);
    });

    //Handle game state, only called at end of turn
    socket.on('gameState', function(data) {
        if(thisTeam != data.turn)
            clearVotes();

        connection.getBoardState(updateBoardStateFunction);
        var turn_text = data.turn == thisTeam ? "Your" : "Enemy";
        $("#turn_marker").html(turn_text);

        if(data.location >= 0 && data.hit_miss > 0) {
            var x = data.location % 10
            var y = Math.floor(data.location / 10);

            var hit_text = data.hit_miss == 12 ? "MISS" : "HIT";

            if(thisTeam == data.turn) { //enemy shot
                $("#e_coords").html(String.fromCharCode(65 + y) + (x + 1));
                $("#e_hit_miss").html(hit_text);
                if(hit_text == "MISS")
                    $("#e_hit_miss").css("color", "red");
                else
                    $("#e_hit_miss").css("color", "green");
            } else {
                $("#coords").html(String.fromCharCode(65 + y) + (x + 1));
                $("#hit_miss").html(hit_text);
                if(hit_text == "MISS")
                    $("#hit_miss").css("color", "red");
                else
                    $("#hit_miss").css("color", "green");
            }
        }
        
        if(data.gameover > 0) {
            gameover(data.gameover);

        }
    });

})();
