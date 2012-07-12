var azure = require('azure')
, uuid = require('node-uuid');

module.exports = WebUser;

function WebUser() {
    this.users = [
        { id: 1, username: 'bob', password: 'b', email: 'bob@example.com' }
        , { id: 2, username: 'joe', password: 'b', email: 'joe@example.com' }
    ];
};

WebUser.prototype = {

    find: function(query, callback) {
        console.log('WebUser.find(' + query + ')');
        self = this;
        for(var i = 0, len = self.users.length; i < len; i++) {
            var user = self.users[i];
            if(user.username === query) {
                console.log('WebUser.find(): found');
                return callback(null, user);
            }
        }
        console.log('WebUser.find(): not found');
        return callback(null, null);
    }

}
