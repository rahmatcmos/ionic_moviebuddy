// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('dash', {
      url: '/dash',
      templateUrl: 'templates/dash.html',
      resolve: {
        isLoggedIn: function(authentication) {
          return authentication.auth();
        }
      },
      controller: 'DashCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});

// authentication service, handles login and logout
app.service('authentication', function($rootScope, $location, $http, $state) {
  var cookieParser = function(cookie) {
    var splitCookie = cookie.split(';');
    for (var i = 0; i < splitCookie.length; i++){
      var leftSide = splitCookie[i].split('=')[0];
      var rightSide = splitCookie[i].split('=')[1];
      if( rightSide === 'undefined') {
        return JSON.parse(leftSide);
      }
    }
  };

  this.auth = function(){
    console.log('In authentication');
    return $http({
      method: 'GET',
      url: '/auth/isLoggedIn'
    })
    .then(function(response){
      console.log(response);
      if (response.data === 'false') {
        $state.go('login');
      }
      if (window.document.cookie !== '') {
        var userObj = cookieParser(window.document.cookie);
        $rootScope.user = userObj;
      }
    });
  };
});

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

