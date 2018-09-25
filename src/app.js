const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// connection to db
const { url } = require('./config/database.js');

mongoose.connect(url)
.then(db => console.log('db connected'))
.catch(err => console.log(err));

require('./config/passport')(passport);

// importing routes

const tamanioRoutes = require('./routes/tamanio')(app, passport);
const tipoRoutes = require('./routes/tipo')(app, passport);
const colorRoutes = require('./routes/color');
const stockRoutes = require('./routes/stock');
const talleRoutes = require('./routes/talle');
const ventaRoutes = require('./routes/venta')(app, passport);
const productoRoutes = require('./routes/producto')(app, passport);


// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}


// required for passport
app.use(session({
	secret: 'stockarcookie',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: (1 * 60 * 60 * 1000) }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
app.use('/venta', isLoggedIn, ventaRoutes);
app.use('/stock', isLoggedIn, stockRoutes);
app.use('/talle', isLoggedIn, talleRoutes);
app.use('/color', isLoggedIn, colorRoutes);
app.use('/tipo', isLoggedIn, tipoRoutes);
app.use('/tamanio', isLoggedIn, tamanioRoutes);
app.use('/producto', isLoggedIn, productoRoutes);
require('./routes/routes.js')(app, passport);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
