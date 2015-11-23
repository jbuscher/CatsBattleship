module.exports = {

    userbase: {},

    addUser: function(user, team) {
        if(this.userExists(user) == false) {
            this.userbase[user] = team;
        }
    },

    deleteUser: function(user) {
        for(var user in this.userbase) {
            if(user == userInQuestion) {
                delete this.userbase[user];
            }
        }
    },

    userExists: function(userInQuestion) {
        for(var user in this.userbase) {
            if(user == userInQuestion) {
                return true;
            }
        }
        return false;
    },

    flushUserBase: function() {
        this.userbase = {};
    }
};