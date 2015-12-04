module.exports = {

    NUM_SPOTS: 100,
    teamOneSpots: [],
    teamTwoSpots: [],

    // maxArray[0] = team one max
    // maxArray[1] = team one max index
    // maxArray[2] = team two max
    // maxArray[3] = team two max index
    maxArray: [0, -1, 0, -1],

    clearVotes: function(teamNum) {
        var spots = this.pickTeamArray(teamNum);
        this.maxArray[this.calculateIndexOfMax(teamNum)] = 0;
        this.maxArray[this.calculateIndexOfMaxIndex(teamNum)] = -1;
        spots = [];
    },

    vote: function(teamNum, location) {
        var spots = this.pickTeamArray(teamNum);
        spots[location] = spots[location]++;
        if (spots[location] > this.maxArray[this.calculateIndexOfMax(teamNum)]) {
            this.maxArray[this.calculateIndexOfMax(teamNum)] = spots[location];
            this.maxArray[this.calculateIndexOfMaxIndex(teamNum)] = location;
        }
    },

    // Returns -1 if no votes received since last clear, 
    // else index of spot with most votes
    getSpotWithMostVotes: function(teamNum) {
        return this.maxArray[this.calculateIndexOfMaxIndex(teamNum)];
    },

    pickTeamArray: function(teamNum) {
        return (teamNum == 1) ? teamOneSpots : teamTwoSpots;
    },

    calculateIndexOfMax: function(teamNum) {
        return 2 * (teamNum - 1);
    },

    calculateIndexOfMaxIndex: function(teamNum) {
        return 2 * (teamNum - 1) + 1;
    }

}