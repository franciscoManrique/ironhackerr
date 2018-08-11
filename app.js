require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var app = express();

//require routes
var friendshipRouter = require('./routes/friendship.routes');
var sessionsRouter = require('./routes/sessions.routes');
var commentsRouter = require('./routes/comments.routes');
var usersRouter = require('./routes/users.routes');
var postsRouter = require('./routes/posts.routes');
var helpRouter = require('./routes/help.routes');

//external configs
require('./configs/db.config');
require('./configs/hbs.config');
require('./configs/passport.config').setup(passport);//le paso passport al setup
require("./configs/session.config")(app);


app.use(passport.initialize()); 
app.use(passport.session());

//cookie and body parser and logs
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//static views
app.use(express.static(path.join(__dirname, 'public')));

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//local variables (must be above the routes in order to work)
app.use((req, res, next) => {
  res.locals.title = 'FACEHACK';
  res.locals.session = req.user; // req.session.currentUser
  next();
});

//main routes
app.use('/users/:userId/posts/:postId/comments', commentsRouter);
app.use('/users/:userId/posts', postsRouter);
app.use('/friendship', friendshipRouter);
app.use('/sessions', sessionsRouter);
app.use('/users', usersRouter);
app.use('/help', helpRouter);

app.use('/posts/:postId/like', (req, res, next) => {
s
  res.json({
    likesCount: 10
  });
});

app.use('/', usersRouter);


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

module.exports = app;
