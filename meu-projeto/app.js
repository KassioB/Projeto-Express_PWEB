var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var usersRouter = require('./routes/users');
var pessoasRouter = require('./routes/pessoas');
var medicosRouter = require('./routes/medicos');
var agendamentoRouter = require('./routes/agendamento');
var authRouter = require('./routes/auth');
var installRouter = require('./routes/install');
var { isAuthenticated, isAdmin } = require('./middlewares/auth');
// admin promotion removed; using Usuario.role 'admin' only

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
app.use(session({ secret: 'trae-secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

// disponibiliza usuario logado para as views
app.use((req, res, next) => { res.locals.user = req.session && req.session.user ? req.session.user : null; next(); });

app.use('/', isAuthenticated, isAdmin, indexRouter);
app.use('/about', isAuthenticated, isAdmin, aboutRouter);
app.use('/users', isAuthenticated, isAdmin, usersRouter);
app.use('/', authRouter);
app.use('/install', isAuthenticated, isAdmin, installRouter);
app.use('/pessoas', isAuthenticated, isAdmin, pessoasRouter);
app.use('/medicos', isAuthenticated, isAdmin, medicosRouter);
app.use('/agendamento', isAuthenticated, isAdmin, agendamentoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// usar o error handler centralizado
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
