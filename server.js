//Imports
var express = require('express'),
fs = require('fs'),
url = require('url'),
path = require('path'),
session = require('client-sessions'),
bodyParser = require('body-parser');

//local imports
var userbase = require('./private_modules/userbase');
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

app.get('', function(request, response) {
    if(userbase.userExists(request.session.user)) {
        response.sendFile(path.join(__dirname + '/client.html'));
    } else {
        response.sendFile(path.join(__dirname + '/index.html'));
    }
});


/*
Takes a join game post request from the form on the splash screen of our website. Checks
if the username exists, if it does, returns them to the homepage with error message. Otherwise
adds them to the userbase, starts a user session, and redirects them to their team page.
TODO: Check if user exists
*/
app.post('/joinGame', function(request, response) {
    var username = request.body.username;
    userbase.addUser(username, teamNum);

    request.session.user = username;
    request.session.team = teamNum; // sets team number to 1 or 2
    teamNum = teamNum %  2 + 1; // sets the next team number to opposite what it is

    response.sendFile(path.join(__dirname + '/client.html'));
});

app.get('/getTeam', function(request, response) {
    response.send(200, request.session.team);
});

/*
TODO FOR MATTIE, fill in with gameboard stuff
*/
app.get('/boardState', function(request, response) {

});

var server = app.listen(port, function() {
  console.log('Battleship server listening at %s', port);
});
