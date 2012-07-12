var azure = require('azure')
, uuid = require('node-uuid');

module.exports = Category;

function Category(storageClient, tableName, partitionKey) {
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

Category.prototype = {

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
    },

    addItem: function(item, callback) {
        self = this;
        item.RowKey = uuid.v1();
        item.PartitionKey = self.partitionKey;
        item.completed = false;
        item.active = "true";
        console.log(item);
        self.storageClient.insertEntity(self.tableName, item,
            function entityInserted(err) {
                if(err) {
                    callback(err);
                }
                callback(null);
            }
        );
    },

    updateItem: function(item, callback) {
        self = this;
        self.storageClient.queryEntity(self.tableName, self.partitionKey, item.RowKey,
            function entityQueried(err, entity) {
                if(err) {
                    callback(err);
                }
                entity.description = item.description;
                self.storageClient.updateEntity(self.tableName, entity,
                function entityUpdated(err) {
                    if(err) {
                        callback(err);
                    }
                    callback(null);
                }
            );
            });
    },

    deleteItem: function(id, callback) {
        self = this;
        this.storageClient.deleteEntity(self.tableName
            , {
                PartitionKey: self.partitionKey
                , RowKey: id
            },
            function(err) {
                if(err) {
                    callback(err);
                }
                callback(null);
            });
    }

}
