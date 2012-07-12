module.exports = Category;

function Category(db) {
    this.db = db;

};

Category.prototype = {

    find: function(query, callback) {
        self = this;
        self.db.collection('categories', function(err, collection) {
            collection.find({}).toArray(function(err, items) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, items);
                }
            });
        });
    },

    addItem: function(item, callback) {
        self = this;
        self.db.collection('categories', function(err, collection) {
            collection.insert(item, function(err, docs) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, docs);
                }
            });
        });
        //item.RowKey = uuid.v1();

        //self.storageClient.insertEntity(self.tableName, item,
        //function entityInserted(error) {
        //  if(error) {
        //      callback(err);
        //  }
        callback(null);
        //});
    },

    updateItem: function(item, callback) {
        self = this;
        //self.storageClient.queryEntity(self.tableName, self.partitionKey, item,
        //function entityQueried(err, entity) {
        //  if(err) {
        //      callback(err);
        //  }
        //  entity.completed = true;
        //  self.storageClient.updateEntity(self.tableName, entity,
        //  function entityUpdated(err) {
        //      if(err) {
        //          callback(err);
        //      }
        callback(null);
        ///  });
        //});
    }

}
