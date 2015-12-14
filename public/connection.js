Connection = function(){
    var xhr = new XMLHttpRequest();

    var DEV_MODE = true;
    var url = "http://107.170.239.215";
    var game_callback = function(){};
    var timeout = 2;


    this.getTeam = function(callback) {
        $.get(url + "/getTeam", function(data, status) {
            console.log("Team request " + status);
            callback(data);
        });
    }

    this.getBoardState = function(callback) {
        $.post(url + "/boardState", function(data, status) {
            console.log("board state request " + status);
            callback(data);
        });
    }


    this.getGameInfo = function(callback) {
        $.get(url + "/gameInfo", function(data, status) {
            callback(data);
        });
    }
}
