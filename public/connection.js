Connection = function(){
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:8080";
    var game_callback = function(){};
    var timeout = 2;


    this.getTeam = function(callback) {
        $.get(url + "/getTeam", function(data, status) {
            console.log(data + " " + status);
            callback(data);
        });
    }
}