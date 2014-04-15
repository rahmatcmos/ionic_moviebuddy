var db = require('./db_config');
var FB = require('fb');

exports.getUser = function(req, res) {
  db.User.findOne({ facebookId: req.params.facebookId }, function (err, user) {
    if (!err) {
      res.send(user);
    } else {
      res.send(err);
    }
  });
};

exports.postUser = function(req, res) {
  var body = req.body;
  var user = new db.User({
    facebookId: body.facebookId,
    facebookToken: body.facebookToken,
    name: body.name,
    email: body.email,
    city: body.location
    // hometown:        ,
    // favMovie:        ,
    // favGenre:        ,
    // age:             { type: Number },
    // favTheater:      ,
    // currentCity:     ,
    // favActor:        ,
    // favDirector:
  });

  user.save(function (err) {
    if (err) { console.log(err); }
  });

  res.send(user);
};

// Updates a user in the DB
exports.putUser = function(req, res) {
  var userObj = req.body.user;
  db.User.findOne({ facebookId: userObj.facebookId }, function (err, user) {
    user.name = userObj.name;
    user.city = userObj.city || '';
    user.favMovie = userObj.favMovie || '';
    user.favGenre = userObj.favGenre || '';
    user.favTheater = userObj.favTheater || '';
    user.favActor = userObj.favActor || '';
    user.age = userObj.age || '';

    user.save(function (err) {
      if (err) { console.log(err); }
    });

    res.send(user);
  });
};

exports.deleteUser = function(req, res) {
  db.User.findOne({ facebookId: req.params.facebookId }, function (err, user) {
    user.remove(function (err) {
      if (!err) {
        res.send();
      } else {
        res.send(err);
      }
    });
  });
};

// Gets a user's friends from the DB
exports.getFriends = function(req, res) {
  db.User.findOne({ facebookId: req.params[0] }, function (err, user) {
    if (!err && user) {
      var usersFriends = [];

      for (var i = 0; i < user.friends.length; i++) {
        db.User.find({ facebookId: user.friends[i] }, function (err, friend) {
          usersFriends.push(friend[0]);

          if (user.friends.length === usersFriends.length) {
            res.send(usersFriends);
          }
        });
      }
    } else {
      res.send(err);
    }
  });
};

exports.updateFriends = function(res, id) {
  db.User.findOne({facebookId: id}, function (err, user){
    if (!err) {
      for (var i = 0; i < res.length; i++){
        db.User.findOne({ facebookId: res[i].uid }, function (err, friend){
          if (!err && friend !== null) {
            var friendId = friend.facebookId;
            var userFriends = user.friends;

            if (userFriends.indexOf(friendId) === -1) {
              userFriends.push(friendId);
              user.save();
            }
          }
        });
      }
    }
  });
};

exports.queryFBFriends = function(token, profile){
  FB.setAccessToken(token);
  FB.api('fql', {
    q: 'SELECT name, uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = ' + profile.id + ')'
  }, function (res) {
    exports.updateFriends(res.data, profile.id);
  });
};

exports.getOuting = function(req, res) {
  // *** TO-DO: Enable find of user- & friend-specific outings.
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();

  db.Outing.find({ 'date': { '$gte': new Date(year, month, day) }}, function (err, outing) {
    if (!err) {
      res.send(outing);
    } else {
      console.log(err);
    }
  });
};

exports.postOuting = function(req, res) {
  var body = req.body;
  console.log(body);
  var outing = new db.Outing({
    movie: body.movie,
    date: body.date,
    theater: body.theater,
    address: body.address,
    city: body.city,
    state: body.state,
    zip: body.zip,
    // invitees: body.invitees,
    attendees: body.attendees,
    organizers: body.organizers
  });

  outing.save(function (err) {
    if (err) { console.log('error in postouting: ', err); }
  });

  res.send(outing);
};

// update outings into database function
exports.putOuting = function(req, res) {
  var body = req.body;
  db.Outing.findById(req.params._id, function (err, outing) {
    outing.movie = body.movie;
    outing.date = body.date;
    outing.theater = body.theater;
    outing.address = body.address;
    outing.city = body.city;
    outing.state = body.state;
    outing.zip = body.zip;
    // outing.invitees = body.invitees;
    outing.attendees = body.attendees;
    outing.organizers = body.organizers;

    outing.save(function (err) {
      if (err) { console.log(err); }
    });

    res.send(outing);
  });
};

// Delete outings handler function
exports.deleteOuting = function(req, res) {
  db.Outing.findById(req.params._id, function (err, outing) {
    outing.remove(function (err) {
      if (!err){
        res.send();
      } else {
        res.send(err);
      }
    });
  });
};

exports.authFacebookCallback = function(req, res, next, passport) {
  passport.authenticate('facebook', function (err, user) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    req.login(user, function (err) {
      if (err) { return next(err); }
      req.session.username = 'farid';
      res.cookie(JSON.stringify(user));
      return res.redirect('http://localhost:8080/#/dash/outings');
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};