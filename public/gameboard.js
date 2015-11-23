(function() {
    "use strict";
    var ROWS = 10;
    var COLS = 10;
    var connection = new Connection;

    $(document).ready(function() {
        buildGameBoard(ROWS, COLS);
        connection.getTeam(function(team) {
            console.log("HEE" + team);
            $("#team_name").html("Team " + team);
        });
    });

    function buildGameBoard(rows, cols) {
        var tableDiv = $("#gametable");
        $($( "<table>" )).appendTo(tableDiv);
        for(var i = 0; i < rows; i++) {
            $($( "<tr>" )).appendTo(tableDiv);
            for(var j = 0; j < cols; j++) {
                $($( "<td></tr>" )).appendTo(tableDiv);
            }
            $($( "</tr>" )).appendTo(tableDiv);
        }
        $($( "</table>" )).appendTo(tableDiv);
    }
})();