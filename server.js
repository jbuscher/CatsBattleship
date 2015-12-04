//Imports
var express = require('express'),
fs = require('fs'),
url = require('url'),
path = require('path'),
session = require('client-sessions'),
bodyParser = require('body-parser');

//local imports
var gameboard = require('./private_modules/battleship.js');

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

/*
TODO FOR MATTIE, fill in with gameboard stuff
*/
app.post('/boardState', function(request, response) {
  console.log(request.session.team);
  console.log(gameboard.getBoardState(request.session.team));
  response.send(gameboard.getBoardState(request.session.team));
});

var server = app.listen(port, function() {
  console.log('Battleship server listening at %s', port);
  gameboard.startNewGame();
});
