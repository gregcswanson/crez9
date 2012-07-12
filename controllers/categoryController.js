var azure = require('azure')
  , async = require('async');


module.exports = CategoryContoller;


function CategoryContoller(category) {
  this.category = category;
}

CategoryContoller.prototype = {

    showCategories: function(req, res) {
        self = this;
        var query = azure.TableQuery
      .select()
      .from(self.category.tableName)
      .where('active eq ?', 'true');
        self.category.find(query, function itemsFound(err, items) {
            console.log(items);
            res.render('category/index.html', { title: 'Index ', items: items });
        });
    },

    addCategory: function(req, res) {
        var self = this;
        var item = {}; // new item
        res.render('category/add.html', { title: 'Add Category', item: item });
    },

    editCategory: function(req, res) {
        var self = this;
        self.category.get(req.params.id, function itemsFound(err, item) {
            console.log(item);
            res.render('category/edit.html', { title: 'Edit ', item: item });
        });
    },

    saveEditCategory: function(req, res) {
        var self = this;
        var item = { RowKey: req.body.id,  description: req.body.description };
        console.log(item);
        self.category.updateItem(item, function itemUpdated(err) {
            if(err) {
                console.log(err);
                throw err;
            }
            res.redirect('/category');
        });
    },

    saveNewCategory: function(req, res) {
        var self = this;
        var item = { description: req.body.description };
        console.log(item);
        self.category.addItem(item, function itemAdded(err) {
            if(err) {
                console.log(err);
                throw err;
            }
            res.redirect('/category');
        });
    },

    deleteCategory: function(req, res) {
        var self = this;
        self.category.get(req.params.id, function itemsFound(err, item) {
            console.log(item);
            res.render('category/delete.html', { title: 'Delete ', item: item });
        });
    },

    saveDeleteCategory: function(req, res) {
        var self = this;
        self.category.deleteItem(req.body.id, function itemDeleted(err) {
            if(err) {
                console.log(err);
                throw err;
            }
            res.redirect('/category');
        });
    }

}