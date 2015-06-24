var express = require('express')
  , load = require('express-load')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , compression = require('compression')
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
app.use(compression());

app.use(cookieParser('iamferraz_blog'));
app.use(expressSession({
    secret: 'iamferraz_blog',
    name: 'iamferraz_blog',
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use('/public', express.static(__dirname + '/public',{
  maxAge: 3600000 // milissegundos
}));

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

app.sendResponse = function(res, success, message, data, config){
  config = typeof config !== 'undefined' ? config : {showNoty:true};
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success : success, message:message, data : data, config: config}));
};

app.checkCaptcha = function(captchaResponse, response, callback){
    var https = require('https');
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=6LeGNQcTAAAAAIwc9Fch23eGYd9hi6TuEEsV6C5N&response=" + captchaResponse, function(resp){
      var data = "";
      resp.on('data', function(chunk){
        data += chunk.toString();
        //console.log(chunk);
      });
      resp.on('end', function() {
        try {
          var parsedData = JSON.parse(data);
          callback(parsedData.success);
        } catch (e) {
          callback(false);
        }
      });
    }).on("error", function(e){
      app.sendResponse(response, false, "WTF Google! Captcha doesn't responds correctly..." + JSON.stringify(e), null,{showNoty: false});
    });
  };

load('models')
  .then('controllers')
  .then('routes')
  .then('schedule')
  .into(app);

app.listen(3000, function(){
  console.log("iamferraz is running bicht!!!");
});
