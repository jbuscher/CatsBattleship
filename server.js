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
  var enemyTeam = team % 2 + 1;
  var location = request.body.location - 1;
  voteCounter.vote(team, location);
  var x = Math.floor(location / 10);
  var y = location % 10;

  battleship.takeShot(enemyTeam, x, y);
  response.send(200);
});

var server = app.listen(port, function() {
  console.log('Battleship server listening at %s', port);
  battleship.startNewGame();
  voteCounter.clearVotes(1);
  voteCounter.clearVotes(2);
});
