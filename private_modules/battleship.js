module.exports = {

    ROWS: 10,
    COLS: 10,

    teamOneGameBoard: {},
    teamTwoGameBoard: {},
    teamOneShips: {},
    teamTwoShips: {},

    sea: 0,


    startNewGame: function() {
        setBoard(1);
        setBoard(2);
        setUpShips(1);
        setUpShips(2);
    },

    setBoard: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        for (var i = 0; i < this.ROWS; i++) {
            var row = [];
            for (var j = 0; j < this.COLUMNS; j++) {
                row.push({type: this.sea, available: 1});
            }
            gameBoard.push(row);
        }
    },



    isGameOver: function() {

    },

    isSpotAvailable: function(teamNum, row, column) {
        return gameBoard[row][column].available === 1;
    },

    // TODO: what if space is not available?
    takeShot: function(teamNum, row, column) {
        var gameBoard = this.chooseGameBoard(teamNum);
        gameBoard[row][column].available = 0;
        if (gameBoard[row][column].type !== 0) {
            // update boats state
        }
    },

    getBoardState: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        return gameBoard;
        // Actually return json 100 element array?
    },

    getNumberOfRemainingShips: function(teamNum) {

    },

    shipSunk: function() {

    },

    setUpShips: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        placeShip(gameBoard, 5, 1);
        placeShip(gameBoard, 4, 2);
        placeShip(gameBoard, 3, 3);
        placeShip(gameBoard, 3, 4);
        placeShip(gameBoard, 2, 5);
    },

    placeShip: function(gameBoard, size, boatNum) {
        var orientation = Math.floor(2 * Math.random());
        var maxRight = this.ROW;
        var maxBottom = this.COLUMN;
        if (orientation == 0) { // up and down facing ship
            maxBottom = this.COLUMN - size;
        } else { // left and right facing ship
            maxRight = this.ROW - size;
        }
        var row = Math.floor(maxRight * Math.random());
        var column = Math.floor(maxBottom * Math.random());

        var properlyPlaced = this.placeShip(gameBoard, row, column, size, boatNum, orientation);
        
        if(!properlyPlaced) {  // there was a collision
            this.placeShip(gameBoard, size);
        }
    },

    placeShip: function(gameBoard, x, y, size, boatNum, orientation) {
        for(int i = 0; i < size; i++) {  // check no current ship already
            if (gameBoard[x][y + i].type !== 0) { // not an available spot
                return false;
            } 
        }
        for(int i = 0; i < size; i++) {
            var yCoordinate = y;
            var xCoordinate = x;
            if (orientation == 0) {
                yCoordinate = y + i;
            } else {
                xCoordinate = x + i;
            }
            gameBoard[xCoordinate][yCoordinate].type = boatNum;
        }
        return true;
    },

    chooseGameBoard: function(teamNum) {
        if (teamNum == 1) {
            return this.teamOneGameBoard;
        } else {
            return this.teamTwoGameBoard;
        }
    }