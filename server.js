//Imports
var express = require('express'),
fs = require('fs'),
url = require('url'),
path = require('path'),
session = require('client-sessions'),
bodyParser = require('body-parser');

//local imports
var battleship = require('./private_modules/battleship.js');
var voteCounter = require('./private_modules/voteCounter.js');

//Globals
var port = 8080;
var app = express();
var teamNum = 1;
var whosTurn = 0;
var TURN_LENGTH = 10; //in seconds
var gameover;

//App config
app.use(session({
  secret: 'cat battleship',
  cookieName: 'session',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(express.static(path.join(__dirname, 'public'))); // uses static files in the public directory
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true })); 


/*
Alternates the assignment of a team to the user, remembers user via cookies
*/
app.get('', function(request, response) {
  if(!request.session.team) {
    request.session.team = teamNum; // sets team number to 1 or 2
    teamNum = teamNum %  2 + 1; // sets the next team number to opposite what it is

  }
  response.sendFile(path.join(__dirname + '/client.html'));
});

app.get('/getTeam', function(request, response) {
    response.send(200, request.session.team);
});

app.post('/boardState', function(request, response) {
  var team = request.session.team;
  response.send(battleship.getBoardState(team));
});

app.post('/sendVote', function(request, response) {
  var team = request.session.team;
  var location = request.body.location - 1;
  voteCounter.vote(team, location);
  response.send(200);  
});

app.get('/gameInfo', function(request, response) {
  response.send(200, whosTurn+","+timeLeft+","+TURN_LENGTH + "," + gameover);
});

var timeLeft; //set turn length
setInterval(function() {  
  timeLeft--;
  //console.log(timeLeft);
  if(timeLeft == 0) {
    timeLeft = TURN_LENGTH;
    var location = voteCounter.getSpotWithMostVotes(whosTurn);
    voteCounter.clearVotes(whosTurn);
    console.log("Team " + whosTurn + " shot at location:"+ location);

    if(location == -1) {
      location = battleship.chooseValidLocation();
    }

    var x = Math.floor(location / 10);
    var y = location % 10;
    var enemyTeam = whosTurn % 2 + 1;
    battleship.takeShot(enemyTeam, x, y);
    gameover = battleship.isGameOver();
    whosTurn = enemyTeam;
  }
}, 1000);

var server = app.listen(port, function() {
  console.log('Battleship server listening at %s', port);
  battleship.startNewGame();
  gameover = 0;
  voteCounter.clearVotes(1);
  voteCounter.clearVotes(2);
  whosTurn = Math.floor(Math.random() * 2) + 1;
  timeLeft = TURN_LENGTH;
});
