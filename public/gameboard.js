(function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS, "#teamBoard");
        buildGameBoard(ROWS, COLS, "#enemyBoard");
        $("#enemyBoard").show();
        $("#teamBoard").hide();

        connection.getTeam(function(team) {
            $("#team_name").html("Team " + team);
        });


        $('input:radio[name=boardChoice]').change(changeRadioButton);
    });

    function buildGameBoard(rows, cols, divName) {
        var tableDiv = $(divName);
        var count = 1;
        $($( "<table>" )).appendTo(tableDiv);
        for(var i = 0; i < rows; i++) {
            $($( "<tr>" )).appendTo(tableDiv);
            for(var j = 0; j < cols; j++) {
                $($( "<td id=\"" + divName + count + "\"></tr>" )).appendTo(tableDiv);
                count++;
            }
            $($( "</tr>" )).appendTo(tableDiv);
        }
        $($( "</table>" )).appendTo(tableDiv);
    }

    function changeRadioButton() {
        if ($("input[name='boardChoice']:checked").val() == 'teamBoardButton') {
            $("#teamBoard").show();
        }
        if ($("input[name='boardChoice']:checked").val() == 'enemyBoardButton') {
            $("#teamBoard").hide();
        }
    }

})();