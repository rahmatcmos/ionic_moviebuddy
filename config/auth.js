// config/auth.js

exports.facebookAuth = {
  'clientID': process.env.FBID, // your App ID
  'clientSecret': process.env.FBSECRET, // your App Secret
  'callbackURL': 'http://moviebuddyapp.herokuapp.com'
};

exports.gmailAuth = {
  user: 'moviebuddyapp@gmail.com',
  pass: 'moviebuddy!'
};