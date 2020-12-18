var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var templatesRouter = require('./routes/templates');
var memesRouter = require('./routes/memes');

var app = express();
const port = 4000

//MongoDB integration
const mongoose = require('mongoose');
const Meme = require('./models/meme.js');

//Set up default mongoose connection
const mongoDB =
'mongodb://localhost:27017/memes'; 
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}); //added new parser bcs old call is deprecated
const db = mongoose.connection;

//Bind connection to error event (Mongo)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/templates', templatesRouter);
app.use('/memes', memesRouter);

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

app.listen(port, function(){
	console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
