module.exports = {

    ROWS: 10,
    COLS: 10,

    teamOneGameBoard: [],
    teamTwoGameBoard: [],
    teamOneShips: {},
    teamTwoShips: {},

    NUM_SHIPS: 5,
    SEA: 6,


    startNewGame: function() {
        this.setBoard(1);
        this.setBoard(2);
        this.setUpShips(1);
        //this.setUpShips(2);
        this.teamOneShips = [5, 4, 3, 3, 2];
        this.teamTwoShips = [5, 4, 3, 3, 2];
    },

    setBoard: function(teamNum) {
        var gameBoard = this.chooseGameBoard(teamNum);
        for (var i = 0; i < this.ROWS; i++) {
            var row = [];
            for (var j = 0; j < this.COLS; j++) {
               row.push({type: this.SEA, available: 1});
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
        (gameBoard[row][column]).available = 0;
        var shotLocationType = (gameBoard[row][column]).type;
        if (shotLocationType !== this.SEA) {
            var ships = teamNum === 1? this.teamOneShips: this.teamTwoShips;
            ships[shotLocationType]--;
        }
    },

    // Returns array of board state.  For each location, divide by 2 to get type
    // and mod by 1 to get availability.

    // If the spot has already been shot at, availability is 0.
    // If the spot is available to be shot at, availability is 1.

    // Type number is boat number.
    // If type is larger than the amount of boats (i.e. if there are 5 boats and you
    // get 6 for type), then it is sea.
    getBoardState: function(teamNum) {
        var result = [];
        var gameBoard = this.chooseGameBoard(teamNum);
        for (var i = 0; i < this.ROWS; i++) {
            for (var j = 0; j < this.COLS; j++) {
                result.push(gameBoard[i][j].available + gameBoard[i][j].type * 2);
            }
        }
        var gameBoard2 = this.chooseGameBoard(teamNum % 2 + 1);
        for (var i = 0; i < this.ROWS; i++) {
            for (var j = 0; j < this.COLS; j++) {
                result.push(gameBoard2[i][j].available + gameBoard2[i][j].type * 2);
            }
        }
        return JSON.stringify(result);
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
        this.placeShips(gameBoard, 5, 0);
        this.placeShips(gameBoard, 4, 1);
        this.placeShips(gameBoard, 3, 2);
        this.placeShips(gameBoard, 3, 3);
        this.placeShips(gameBoard, 2, 4);
    },

    placeShips: function(gameBoard, size, boatNum) {
        var orientation = Math.floor(2 * Math.random());
        var maxRight = this.ROWS;
        var maxBottom = this.COLS;
        if (orientation == 0) { // up and down facing ship
            maxBottom = this.COLS - size;
        } else { // left and right facing ship
            maxRight = this.ROWS - size;
        }
        var row = Math.floor(maxRight * Math.random());
        var column = Math.floor(maxBottom * Math.random());

        var properlyPlaced = this.placeShip(gameBoard, row, column, size, boatNum, orientation);
        
        if(!properlyPlaced) {  // there was a collision
            this.placeShip(gameBoard, row, column, size, boatNum, orientation);
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
            if (gameBoard[xCoordinate][yCoordinate].type !== this.SEA) { // not an available spot
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