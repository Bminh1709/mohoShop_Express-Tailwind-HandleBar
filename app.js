var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin/adminProduct');
var categoryRouter = require('./routes/admin/adminCategory');
var productRouter = require('./routes/product');

var app = express();

// view engine setup
app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    split: function (str, separator, index) {
      return str.split(separator)[index];
    },
    splitImgs: function (str, separator) {
      return str.split(separator);
    },
    eq: function (v1, v2) {
      return v1 === v2;
    },
    formatCurrency: function (value) {
      const numericValue = Number(value);
      const formattedValue = numericValue.toLocaleString('vi-VN');
      return formattedValue;
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'buiminh',
  resave: false,
  saveUninitialized: true,
}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/access', authRouter);
app.use('/admin', adminRouter);
app.use('/admin/category', categoryRouter);
app.use('/product', productRouter);

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

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});

module.exports = app;
