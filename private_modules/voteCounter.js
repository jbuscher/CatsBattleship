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
        for (var i = 0; i < 100; i ++) {
            spots[i] = 0;
        }
    },

    vote: function(teamNum, location) {
        var spots = this.pickTeamArray(teamNum);
        spots[location]++;
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
        if (teamNum === 1) {
            return this.teamOneSpots;
        } else {
            return this.teamTwoSpots;
        }
        //return (teamNum === 1) ? this.teamOneSpots : this.teamTwoSpots;
    },

    calculateIndexOfMax: function(teamNum) {
        return 2 * (teamNum - 1);
    },

    calculateIndexOfMaxIndex: function(teamNum) {
        return 2 * (teamNum - 1) + 1;
    },

    getVoteCountAt: function(team, location) {
        var array = this.pickTeamArray(team);
        return array[location];
    },

    getVoteCounts: function() {
        var result = [];
        var array = this.pickTeamArray(1);
        for(var i = 0; i < this.NUM_SPOTS; i++) {
            result.push(array[i]);
        }
        var array2 = this.pickTeamArray(2);
        for(var i = 0; i < this.NUM_SPOTS; i++) {
            result.push(array2[i]);
        }
        return result;
    },

}