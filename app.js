var express = require('express')
  , load = require('express-load')
  , bodyParser = require('body-parser')
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
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

app.listen(3000, function(){
  console.log("iamferraz is running bicht!!!");
});
