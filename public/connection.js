Connection = function(){
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:8080";
    var game_callback = function(){};
    var timeout = 2;


    this.getTeam = function(callback) {
        $.get(url + "/getTeam", function(data, status) {
            console.log("Team request" + status);
            callback(data);
        });
    }

    this.getBoardState = function(callback) {
        $.post(url + "/boardState", function(data, status) {
            console.log("board state request" + status);
            callback(data);
        })
    }

    this.postVote = function(id) {
        $.post(url + "/sendVote", { location: parseInt(id)},function(data, status) {
            console.log("post vote" + status);
        })
    }
}
