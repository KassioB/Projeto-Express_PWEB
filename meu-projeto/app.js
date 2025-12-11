var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var aboutRouter = require('./routes/about');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// removido contatoRouter após migração para Pessoas
var pessoasRouter = require('./routes/pessoas');
var medicosRouter = require('./routes/medicos');
var agendamentoRouter = require('./routes/agendamento');

var app = express();

const helmet = require('helmet');
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/pessoas', pessoasRouter);
app.use('/medicos', medicosRouter);
app.use('/agendamento', agendamentoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// usar o error handler centralizado
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
