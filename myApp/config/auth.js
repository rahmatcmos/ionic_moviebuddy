// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'    : '227436327446392', // your App ID
    'clientSecret'  : '9491a0d640daf987b3897361b7f19f1c', // your App Secret
    'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
  }
};
