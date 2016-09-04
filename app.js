const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swig = require('swig');

const routeHome = require('./routes/index');
const routeImport = require('./routes/import');
const routeLabel = require('./routes/label');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// view engine setup
app.engine('html', swig.renderFile);
app.set('view cache', false);
swig.setDefaults({cache: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, '/dist/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routeHome);
app.use('/import', routeImport);
app.use('/label', routeLabel);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.url}`);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
