const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

module.exports = (app, passport) => {

	// index routes
	app.get('/', (req, res) => {
		if (req.isAuthenticated())
			res.render('home', { titulo: 'Home' });
		else
			res.redirect('login');
	});

	//login view
	app.get('/login', (req, res) => {
		res.render('login/login.ejs', {
			message: req.flash('loginMessage'),
			titulo: 'Usuario'
		});
	});

	app.get('/home', (req, res) => {
		res.redirect('home');
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/login'
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('login/signup', {
			message: req.flash('signupMessage'),
			titulo: 'Usuario'
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	//profile view
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('login/profile', {
			user: req.user,
			titulo: 'Usuario'
		});
	});

	app.get('/list', async (req, res) => {
		const usuarios = await Usuario.find();
		res.render('login/list.ejs', {
			usuarios,
			titulo: 'Usuario'
		});
	});

	app.get('/delete/:id', isLoggedIn, async (req, res, next) => {
		let { id } = req.params;
		await Usuario.remove({ _id: id });
		res.redirect('/list');
	});

	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

