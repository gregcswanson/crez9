var azure = require('azure')
, uuid = require('node-uuid');

/*
    Staff
    -----
    Partition: Tenant
    RowKey: Email

*/

module.exports = Staff;

function Staff(storageClient, tableName, partitionKey) {
    this.storageClient = storageClient;
    this.tableName = tableName;
    this.partitionKey = partitionKey;

    this.storageClient.createTableIfNotExists(tableName,
        function tableCreated(err) {
            if(err) {
                console.log(err);
                throw err;
            }
        });

};

Staff.prototype = {

    find: function(query, callback) {
        self = this;
        self.storageClient.queryEntities(query,
            function entitiesQueried(err, entities) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, entities);
                }
            }
        );
    },

    get: function(id, callback) {
        self = this;
        this.storageClient.queryEntity(self.tableName, self.partitionKey, id, callback);
    }

}
