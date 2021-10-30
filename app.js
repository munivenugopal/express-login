var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var editRouter = require('./routes/edit');
var deleteRouter = require('./routes/delete');
var addRouter = require('./routes/add');
var viewRouter = require('./routes/view');

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

app.use('/', indexRouter);
app.use('/edit',editRouter);
app.use('/delete',deleteRouter);
app.use('/add',addRouter);
app.use('/view',viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,(err)=>{
  if (err) return console.log(err)
  else return console.log("Express is Running on Port number 3000")
})

module.exports = app;
