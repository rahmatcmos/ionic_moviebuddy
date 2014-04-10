// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'    : '1391051064505902', // your App ID
    'clientSecret'  : 'cb2885401ea34d037f470a1b525aba9e', // your App Secret
    'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
  }
};
