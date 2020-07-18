const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function (req, res) {
    res.render('landing')
});

router.get('/register', function (req, res) {
    if( req.query.origin )
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')
    res.render('register')
});

router.post('/register', function (req, res) {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', `Welcome to my blog, ${user.username}!`)
            res.redirect('/posts');
        });
    });
});

router.get('/login', function (req, res) {
    if( req.query.origin )
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')
    res.render('login')
});

router.post('/login', function (req, res, next) {
    let returnTo = '/'
    if (req.session.returnTo) {
        returnTo = req.session.returnTo;
        delete req.session.returnTo;
    }
    passport.authenticate('local',
        {
            successRedirect: returnTo,
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: `Welcome to my blog, ${req.body.username}!`
        })(req, res);
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Bye!')
    res.redirect('/posts');
});

module.exports = router;