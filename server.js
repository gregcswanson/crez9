
/**
* Module dependencies.
*/

var express = require('express')
    , routes = require('./routes')
    , Db = require('mongodb').Db
    , Server = require('mongodb').Server;
var azure = require('azure');
var uuid = require('node-uuid');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

/* setup all cron jobs */
var cronJob = require('cron').CronJob;
new cronJob('*/10 * * * * *', function() {
    var d = new Date();
    //console.log(uuid.v1());
    //console.log('this background task started: ' + d.toString());
}, null, true, null);

/* configure authentication */
passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log('authenticate (' + username + ', ' + password + ')');
      webUser.find(username, function(err, user) {
          if(err) { return done(err); }
          if(!user) {
              console.log('authenticate ' + username + ', not found');
              return done(null, false, { message: 'Unknown user' });
          }
          if(user.password != user.password) {
              console.log('authenticate ' + username + ', invalid password');
              return done(null, false, { message: 'Invalid password' });
          }
          console.log('authenticated');
          return done(null, user);
      });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    webUser.find(id, function(err, user) {
        done(err, user);
    });
});

/* configure mongoDB 
var db = new Db('cloud', new Server('flame.mongohq.com', 27106, {}), {auto_reconnect: true});
db.open(function(err) {
    console.log('authenticating');
    db.authenticate(
        'test',
        'test123',
        function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('db ready');
            }
        }
    );
});*/

/* configure azure */
var tableName = 'categories'
  , partitionKey = 'all'
  , accountName = 'creznode'
  , accountKey = '8QLySuGtMGNOmB8zI+SAfuHVSb5hKWXTqALCe3YPz0iBEaxlbOyHY7O2CpsZqXVwzMoO4WRe43FB0y24L+RIvA==';

/* setup models */
var WebUser = require('./models/webuser.js');
var webUser = new WebUser();

/* setup the controllers */
var CategoryController = require('./controllers/categorycontroller.js');
var Category = require('./models/category.js');
var category = new Category(
    azure.createTableService(accountName, accountKey)
    , tableName
    , partitionKey);
var CategoryMongoDB = require('./models/categoryMongoDB.js');
//var categoryMongoDB = new CategoryMongoDB(db);
var categoryController = new CategoryController(category); // Azure Table Storage
//var categoryController = new CategoryController(categoryMongoDB); // MongoDB Storage


var HomeController = require('./controllers/homecontroller.js');
var homeController = new HomeController();

/* start the web server */
var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.register(".html", require("ejs")); // Register EJS to process the server html
    app.set('view options', {
        open: '{{',
        close: '}}'
    }); // Change the open and close tags, no real reason
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'CrezwellInVegas2012' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.dynamicHelpers({ messages: require('./helpers/flash-messages.js') });
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes
app.get('/login', function(req, res) { res.render('login.html', { layout: false, title: 'Login' }); });
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'Invalid credentials'
    })
);
    app.get('/logout', ensureAuthenticated, function(req, res) {
        req.logOut();
        res.redirect('/');
    });

    app.get('/', function(req, res) {
        //req.flash("info", "herp derp")
        //req.flash("success", "herp derp")
        //req.flash("secondary", "herp derp")
        //req.flash("alert", "herp derp")
        if(req.isAuthenticated()) {
            homeController.index(req, res);
        } else {
            res.redirect('/login');
        }
    }
    // homeController.index.bind(homeController));
);
app.get('/category', ensureAuthenticated, categoryController.showCategories.bind(categoryController));
app.get('/category/add', ensureAuthenticated, categoryController.addCategory.bind(categoryController));
app.post('/category/add', ensureAuthenticated, categoryController.saveNewCategory.bind(categoryController));
app.get('/category/edit/:id', ensureAuthenticated, categoryController.editCategory.bind(categoryController));
app.post('/category/edit/:id', ensureAuthenticated, categoryController.saveEditCategory.bind(categoryController));
app.get('/category/delete/:id', ensureAuthenticated, categoryController.deleteCategory.bind(categoryController));
app.post('/category/delete/:id', ensureAuthenticated, categoryController.saveDeleteCategory.bind(categoryController));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(process.env.port || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
