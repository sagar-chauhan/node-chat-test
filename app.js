var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var Routes = require('./routes/index');
var mongoose = require('mongoose');
var url = 'mongodb://localhost/chat-assignment';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
err => {
  if (err) {
    console.log("Connection Error: ", err);
  } else {
    console.log("Successfully Connected");
  }
}
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Welcome Route for api 
app.get('/api', function(req, res, next) {
  res.status(200).json({
     status: true,
     message: "Welcome to test API, Ready to Handle Requests..!!"
  });
});

app.use('/api', Routes.chatRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
