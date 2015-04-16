var express = require('express')
  , load = require('express-load')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , app = express()
  , mongoose = require('mongoose')
;

global.db = mongoose.connect('mongodb://localhost/iamferraz_blog');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("MongoDB is ready!!! Supamida can now make your changes!!!")
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser('iamferraz_blog'));
app.use(expressSession({
    secret: 'iamferraz_blog',
    name: 'iamferraz_blog',
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.isAuthenticated = function (req,res,next){
  console.log("checando autenticacao");
  if (req.session.user == undefined || req.session.user == null) {  
    if(req.method == 'POST'){
      app.sendResponse(res, false, "logged in to make any request", null);
    }else{
      res.redirect('/admin');
    }
    return;
  }
  return next();
};

app.sendResponse = function(res, success, message, data){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success : success, message:message, data : data}));
};

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

app.listen(3000, function(){
  console.log("iamferraz is running bicht!!!");
});
