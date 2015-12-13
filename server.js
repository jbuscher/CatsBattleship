//Imports
var express = require('express'),
app = express(),
fs = require('fs'),
url = require('url'),
path = require('path'),
session = require('client-sessions'),
bodyParser = require('body-parser'),
http = require('http').Server(app);
io = require('socket.io')(http);

//local imports
var battleship = require('./private_modules/battleship.js');
var voteCounter = require('./private_modules/voteCounter.js');

//Globals
var port = 8080;
var teamNum = 1;
var whosTurn = 0;
var TURN_LENGTH = 11; //in seconds
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

// socket connections
io.on('connection', function(socket){
  console.log('a user connected');
  socket.send({turn:whosTurn, votes:voteCounter.getVoteCounts()});
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('vote', function(data) {
    var team = data.team;
    var location = data.location
    console.log("Received Location = " + location);
    voteCounter.vote(team, location);
    io.sockets.emit('indyVote', {location:location, voteCount: voteCounter.getVoteCountAt(team, location), team:team});
  });
});



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

var timeLeft; //set turn length
setInterval(function() {  
  timeLeft--;
  io.sockets.emit('timer', timeLeft);
  if(timeLeft == 0) {
    timeLeft = TURN_LENGTH;
    var location = voteCounter.getSpotWithMostVotes(whosTurn);
    voteCounter.clearVotes(whosTurn);
    console.log("Team " + whosTurn + " shot at location:"+ location);

    var enemyTeam = whosTurn % 2 + 1;
    if(location == -1) {
      location = battleship.chooseValidLocation(enemyTeam);
    }

    var x = Math.floor(location / 10);
    var y = location % 10;
    battleship.takeShot(enemyTeam, x, y);
    var hit_miss = battleship.getLocationState(enemyTeam, x, y);

    gameover = battleship.isGameOver();
    whosTurn = enemyTeam;
    io.sockets.emit('gameState', {turn:whosTurn, gameover:gameover, location:location, hit_miss: hit_miss});
    if(gameover > 0) {
      resetGame();
    }
  }
}, 1000);

function resetGame() {
  battleship.startNewGame();
  gameover = 0;
  voteCounter.clearVotes(1);
  voteCounter.clearVotes(2);
  whosTurn = Math.floor(Math.random() * 2) + 1;
}

var server = http.listen(port, function() {
  console.log('Battleship server listening at %s', port);
  battleship.startNewGame();
  gameover = 0;
  voteCounter.clearVotes(1);
  voteCounter.clearVotes(2);
  whosTurn = Math.floor(Math.random() * 2) + 1;
  timeLeft = TURN_LENGTH;
});
