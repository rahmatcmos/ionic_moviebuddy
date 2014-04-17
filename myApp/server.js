/* global require, process */
var express = require('express');
var handler = require('./config/handler');

var app = express();
var port = process.env.PORT || 8080;

// initialize passport
var passport = require('./config/passport').passport;

var isLoggedIn = function(req, res) {
  if (req.isAuthenticated()){
    res.send(req.session.passport.user);
  } else {
    res.send('false');
  }
};

var authenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/www'));
  app.use(express.session({secret: 'ilovefarid'}));
  app.use(passport.initialize());
  app.use(passport.session());
});

app.get(   '/api/user/:facebookId', authenticated, handler.getUser);
app.post(  '/api/user', authenticated, handler.postUser);
app.put(   '/api/user/:facebookId', authenticated, handler.putUser);
app.delete('/api/user/:facebookId', authenticated, handler.deleteUser);

app.get(   '/api/friends/*', authenticated, handler.getFriends);

app.get(   '/api/outings', handler.getOuting);
app.post(  '/api/outings', handler.postOuting);
app.put(   '/api/outings', handler.putOuting);
app.delete('/api/outings', handler.deleteOuting);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
app.get('/auth/facebook/callback',function(req, res, next){
  handler.authFacebookCallback(req, res, next, passport);
});

app.get('/auth/isLoggedIn', isLoggedIn);

app.get('/logout', handler.logout);

// redirect any other funky request to the home page
app.get('/*', function(req, res) {
  res.redirect('/');
});

app.listen(port);
console.log('Listening on ' + port);
