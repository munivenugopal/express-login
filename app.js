var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');


var productRouter = require('./routes/products');
var sellerRouter = require('./routes/sellers');
var categoryRouter = require('./routes/categories');
var userRouter = require('./routes/user');

var app = express();

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

con.connect((err)=>{
  if (err) return console.log("the error happened while trying to create a connection with mysql:\n"+err);
  console.log("Connected to MySQL");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret:'newpassword' ,saveUninitialized: true,resave: true }));

app.use('/products', productRouter);
app.use('/sellers', sellerRouter);
app.use('/categories',categoryRouter);
app.use('/user',userRouter);
app.get('/',(req,res)=>{
  res.render('home');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(res.locals.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(res.locals.error);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,(err)=>{
  if(err) return console.log('error while listening to port 3000'+err);
  else return console.log("Express is Running on Port number 3000");
})

module.exports = app;
