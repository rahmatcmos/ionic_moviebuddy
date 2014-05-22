// config/auth.js

exports.facebookAuth = {
  'clientID': process.env.FBID || '225403147654068', // your App ID
  'clientSecret': process.env.FBSECRET || '0bb841a53a02a76e177abe3073ee54b9', // your App Secret
  'callbackURL': 'http://moviebuddyapp.herokuapp.com/auth/facebook/callback'
};

exports.gmailAuth = {
  user: 'moviebuddyapp@gmail.com',
  pass: 'moviebuddy!'
};