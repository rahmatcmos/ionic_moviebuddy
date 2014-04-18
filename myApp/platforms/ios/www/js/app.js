// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic','ngAnimate','xeditable', 'starter.controllers', 'starter.services' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen();
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
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
      controller: 'LoginController'
    })
    .state('dash', {
      url: '/dash',
      abstract: true,
      templateUrl: 'templates/dash.html',
      resolve: {
        isLoggedIn: function(authentication) {
          return authentication.auth();
        },
        getZipandMovies: function($rootScope, getLocation, getTheaterData) {
          getLocation.getZip()
          .then(function(){
            getTheaterData.getMovies();
          });
        }
      },
      controller: 'DashController'
    })
    .state('dash.outings', {
      url: '/outings',
      views: {
        'outings': {
          templateUrl: 'templates/outings.html',
          controller: 'OutingsController'
        }
      },
      resolve: {
        isLoggedIn: function(authentication){
          return authentication.auth();
        }
      }
    })
    .state('dash.movies', {
      url: '/movies',
      views: {
        'movies' : {
          templateUrl: 'templates/movies.html',
          controller: 'MoviesController'
        }
      },
      resolve: {
        isLoggedIn: function(authentication) {
          return authentication.auth();
        }
      }
    })
    .state('dash.profile', {
      url: '/profile',
      views: {
        'profile' : {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileController'
        }
      },
      resolve: {
        isLoggedIn: function(authentication) {
          return authentication.auth();
        }
      }
    })
    .state('dash.friends', {
      url: '/friends',
      views: {
        'friends' : {
          templateUrl: 'templates/friends.html',
          controller: 'FriendsController'
        }
      },
      resolve: {
        isLoggedIn: function(authentication) {
          return authentication.auth();
        }
      }
    })
    .state('/#/dash/outings', {
      url: '/dash/outings',
      views: {
        'outings': {
          templateUrl: 'templates/outings.html',
          controller: 'OutingsController'
        }
      },
      resolve: {
        isLoggedIn: function(authentication){
          return authentication.auth();
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = '//connect.facebook.net/en_US/all.js';
  ref.parentNode.insertBefore(js, ref);
}(document));

