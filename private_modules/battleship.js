module.exports = {

    ROWS: 10,
    COLS: 10,

    teamOneGameBoard: {},
    teamTwoGameBoard: {},
    teamOneShips: {},
    teamTwoShips: {},

    sea: -1,


    startNewGame: function() {
        setBoard(1);
        setBoard(2);
        setUpShips(1);
        setUpShips(2);
        this.teamOneShips = [5, 4, 3, 3, 2];
        this.teamTwoShips = [5, 4, 3, 3, 2];
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
        return this.getNumberOfRemainingShips(1) === 0 || this.getNumberOfRemainingShips(2) === 0;
    },

    isSpotAvailable: function(teamNum, row, column) {
        return gameBoard[row][column].available === 1;
    },

    // TODO: what if space is not available?
    takeShot: function(teamNum, row, column) {
        var gameBoard = this.chooseGameBoard(teamNum);
        gameBoard[row][column].available = 0;
        var shotLocationType = gameBoard[row][column].type;
        if (shotLocationType !== this.sea) {
            var ships = teamNum === 1? this.teamOneShips: this.teamTwoShips;
            ships[shotLocationsType]--;
        }
    },

    getBoardAvailabilities: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        var availabilitiesArray = {};
        for (var i = 0; i < this.ROWS; i++) {
            for (var j = 0; j < this.COLUMNS; j++) {
                availabilitiesArray.push(gameBoard[i][j].available);
            }
        }
        return JSON.stringify(availabilitiesArray);
    },

    getBoardShipLocations: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        var availabilitiesArray = {};
        for (var i = 0; i < this.ROWS; i++) {
            for (var j = 0; j < this.COLUMNS; j++) {
                availabilitiesArray.push(gameBoard[i][j].type);
            }
        }
        return JSON.stringify(availabilitiesArray);
    },

    getNumberOfRemainingShips: function(teamNum) {
        var total = 0;
        var ships = teamNum === 1? this.teamOneShips: this.teamTwoShips;
        for (var i = 0; i < ships.length; i++) {
            if (ships[i] > 0) {
                total++;
            }
        }
        return total;
    },

    shipSunk: function(teamNum, shipNum) {
        var ships = teamNum === 1? this.teamOneShips: this.teamTwoShips;
        return ships[shipNum] === 0;
    },

    setUpShips: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        placeShip(gameBoard, 5, 0);
        placeShip(gameBoard, 4, 1);
        placeShip(gameBoard, 3, 2);
        placeShip(gameBoard, 3, 3);
        placeShip(gameBoard, 2, 4);
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
        if (!this.checkAvailability(gameBoard, x, y, size, orientation)) {
            return false;
        }
        for(var i = 0; i < size; i++) {
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

    checkAvailability: function(gameBoard, x, y, size, orientation) {
        for(var i = 0; i < size; i++) {  // check no current ship already
            var yCoordinate = y;
            var xCoordinate = x;
            if (orientation == 0) {
                yCoordinate = y + i;
            } else {
                xCoordinate = x + i;
            }
            if (gameBoard[xCoordinate][yCoordinate].type !== this.sea) { // not an available spot
                return false;
            } 
        }
        return true;
    },

    chooseGameBoard: function(teamNum) {
        if (teamNum == 1) {
            return this.teamOneGameBoard;
        } else {
            return this.teamTwoGameBoard;
        }
    },
}