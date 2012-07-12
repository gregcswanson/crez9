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
      res.render('category/index.html',{title: 'Index ', items: items});
    });
  },


  addCategory: function(req,res) {
    var self = this      
    var item = req.body.item;
    self.category.addItem(item, function itemAdded(err) {
      if(err) {
        throw err;
      }
      res.redirect('home');
    });
  }
    
}