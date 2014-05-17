// config/auth.js

exports.facebookAuth = {
  'clientID': '227436327446392', // your App ID
  'clientSecret': '9491a0d640daf987b3897361b7f19f1c', // your App Secret
  'callbackURL': 'http://localhost:8080/auth/facebook/callback'
};

exports.gmailAuth = {
  user: 'moviebuddyapp@gmail.com',
  pass: 'moviebuddy!'
};