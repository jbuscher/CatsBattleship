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

        for(var i = 1; i <= ROWS*COLS; i++) {
            $("#enemyBoard" + i).click(function() {
                console.log("click" + this.id);
            });
        }
        $('input:radio[name=boardChoice]').change(changeRadioButton);
    });

    function buildGameBoard(rows, cols, divName) {
        var tableDiv = $("#" + divName);
        var count = 1;
        var htmlString = "";
        htmlString += "<table>";
        for(var i = 0; i < rows; i++) {
            htmlString += "<tr>";
            for(var j = 0; j < cols; j++) {
                htmlString += "<td id=\"" + divName + count + "\"></td>";
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
        }
        if ($("input[name='boardChoice']:checked").val() == 'enemyBoardButton') {
            $("#teamBoard").hide();
        }
    }

})();