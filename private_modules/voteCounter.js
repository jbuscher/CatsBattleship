module.exports = {

    NUM_SPOTS: 100,
    spots: [],
    max: 0,
    maxIndex: -1,

    clearVotes: function() {
        this.spots = [];
    },

    vote: function(location) {
        this.spots[location] = this.spots[location]++;
        if (this.spots[location] > this.max) {
            this.max = this.spots[location];
            this.maxIndex = location;
        }
    },

    getSpotWithMostVotes: function() {
        return maxIndex;
    }
}