/*
WORK IN PROGRESS

TODO: Keep track of ships.
*/

Battleship = function(){
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:8080";
    var game_callback = function(){};
    //var timeout = 2;
    var ROWS = 10;
    var COLS = 10;

    var teamOneGameBoard;;
    var teamTwoGameBoard;
    var teamOneShips;
    var teamTwoShips;

    var sea = 0;
    var boat = 1;


    this.startNewGame = function() {
        setBoard(1);
        setBoard(2);
        setUpShips(1);
        setUpShips(2);
    }

    this.setBoard = function(teamNum) {
        var gameBoard = chooseGameBoard(teamNum);
        for (var i = 0; i < ROWS; i++) {
            var row = [];
            for (var j = 0; j < COLUMNS; j++) {
                row.push({type: sea, available: 1});
            }
            gameBoard.push(row);
        }
    }



    this.isGameOver = function() {

    }

    this.isSpotAvailable = function(teamNum, row, column) {
        return gameBoard[row][column].available === 1;
    }

    // TODO: what if space is not available?
    this.takeShot = function(teamNum, row, column) {
        var gameBoard = chooseGameBoard(teamNum);
        gameBoard[row][column].available = 0;
        if (gameBoard[row][column].type == boat) {
            // update boats state
        }
    }

    this.getBoardState = function(teamNum) {
        var gameBoard = chooseGameBoard(teamNum);
        return gameBoard;
    }

    this.getNumberOfRemainingShips = function(teamNum) {

    }

    this.setUpShips = function(teamNum) {
        var gameBoard = chooseGameBoard(teamNum);
        placeShip(gameBoard, 5);
        placeShip(gameBoard, 4);
        placeShip(gameBoard, 3);
        placeShip(gameBoard, 3);
        placeShip(gameBoard, 2);
    }

    this.placeShip = function(gameBoard, size) {
        var direction = Math.floor(2 * Math.random());
        var maxRight = ROW;
        var maxBottom = COLUMN;
        if (direction == 0) { // up and down facing ship
            maxBottom = COLUMN - size;
        } else { // left and right facing ship
            maxRight = ROW - size;
        }
        var row = Math.floor(maxRight * Math.random());
        var column = Math.floor(maxBottom * Math.random());
        var properlyPlaced = false;

        if (direction == 0) {
            properlyPlaced = placeVerticalShip(gameBoard, row, column, size);
        } else {
            properlyPlaced = placeHorizontalShip(gameBoard, row, column, size);
        }
        if(!properlyPlaced) {  // there was a collision
            placeShip(gameBoard, size);
        }
    }

    this.placeVerticalShip = function(gameBoard, x, y, size) {
        for(int i = 0; i < size; i++) {  // check no current ship already
            if (gameBoard[x][y + i].type === ship) {
                return false;
            } 
        }
        for(int i = 0; i < size; i++) {
            gameBoard[x][y + i].type = ship;
        }
        return true;
    }

    this.placeHorizontalShip = function(gameBoard, x, y, size) {
        for(int i = 0; i < size; i++) {  // check no current ship already
            if (gameBoard[x + i][y].type === ship) {
                return false;
            } 
        }
        for(int i = 0; i < size; i++) {
            gameBoard[x + i][y].type = ship;
        }
        return true;
    }

    this.chooseGameBoard = function(teamNum) {
        if (teamNum == 1) {
            return teamOneGameBoard;
        } else {
            return teamTwoGameBoard;
        }
    }
}