var app = angular.module('starter.services', []);


// get friends service
app.service('getFriends', function($http) {
  this.friendsData = function(facebookId) {
    return $http({
      method: 'GET',
      url: '/api/friends/' + facebookId
    });
  };
});

// get movies service
app.service('getRTMovies', ['$http','$q', function ($http, $q) {

  this.allMovies = [];

  // Gets all data for movies currently in theaters and stores the movie objects in the allMovies array.
  this.getMovieData = function(queryPage, queryPageLimit, deferred) {
    var self = this;
    var rottenTomatoesUrl = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?callback=JSON_CALLBACK&apikey=63za93cgdtv88ves8p6d9wrk';
    var totalMovies;
    var totalQueryPages;
    var query = rottenTomatoesUrl + '&page_limit=' + queryPageLimit + '&page=' + queryPage;

    deferred = deferred || $q.defer();

    $http.jsonp(query)
      .success(function (data) {

        totalMovies = data.total;
        totalQueryPages = Math.ceil(totalMovies / queryPageLimit);
        self.allMovies = self.allMovies.concat(data.movies);
        queryPage++;

        if (queryPage <= totalQueryPages) {
          self.getMovieData(queryPage, queryPageLimit, deferred);
        } else {
          deferred.resolve(self.allMovies);
        }

      });

    return deferred.promise;
    
  };
}]);

app.service('getTheaterData', ['$http', '$rootScope', 'getRTMovies', function ($http, $rootScope, getRTMovies){


  var date = new Date();
  var year = date.getYear() + 1900;
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (day < 10)   { day = '0' + day;     }
  if (month < 10) { month = '0' + month; }

  var today = year +'-'+ month + '-'+ day;

  this.getMovies = function() {

    var query = 'http://data.tmsapi.com/v1/movies/showings?startDate='+today+'&zip='+ $rootScope.currentZip +'&api_key=evgps6crhu6hxpyczeh9k5er';

    $http.get(query)
    .then(function(data){
      $rootScope.movies = data.data;
      $rootScope.allMovies = {};
      for (var i = 0; i < $rootScope.movies.length; i++) {
        $rootScope.allMovies[$rootScope.movies[i].title.toUpperCase()] = $rootScope.movies[i];
      }
      getRTMovies.getMovieData(1, 50)
      .then(function(movies){

        var rtMovies = movies;

        for (var i = 0; i < rtMovies.length; i++) {

          var rtMovie = rtMovies[i];

          if ($rootScope.allMovies[rtMovie.title.toUpperCase()]) {

            var movie = $rootScope.allMovies[rtMovie.title.toUpperCase()];

            movie.thumbnail = rtMovie.posters.detailed || 'http://images.rottentomatoescdn.com/images/redesign/poster_default.gif';
            movie.critics_score = rtMovie.ratings.critics_score || 0;
            movie.audience_score = rtMovie.ratings.audience_score || 0;
            movie.critics_consensus = rtMovie.critics_consensus;
            movie.synopsis = rtMovie.synopsis || movie.longDescription || '';
            movie.runtime = rtMovie.runtime || 0;
          }
        }

        for (var movie in $rootScope.allMovies) {
          $rootScope.allMovies[movie].thumbnail =  $rootScope.allMovies[movie].thumbnail ? $rootScope.allMovies[movie].thumbnail : 'http://images.rottentomatoescdn.com/images/redesign/poster_default.gif';
          $rootScope.allMovies[movie].critics_score = $rootScope.allMovies[movie].critics_score ? $rootScope.allMovies[movie].critics_score : 0;
          $rootScope.allMovies[movie].audience_score = $rootScope.allMovies[movie].audience_score ? $rootScope.allMovies[movie].audience_score : 0;
          $rootScope.allMovies[movie].synopsis = $rootScope.allMovies[movie].synopsis ? $rootScope.allMovies[movie].synopsis : $rootScope.allMovies[movie].longDescription;
          $rootScope.allMovies[movie].runtime = $rootScope.allMovies[movie].runtime ? $rootScope.allMovies[movie].runtime : 0;
        }

      });

    });
  };


}]);

app.service('getUsers', function($http) {
  this.getUser = function(facebookId) {
    return $http({
      method: 'GET',
      url: '/api/user/' + facebookId
    });
  };
});

app.service('updateUsers', function($http) {
  this.updateUser = function(facebookId, userObj) {
    return $http.put('/api/user/' + facebookId, { user: userObj });
  };
});

app.service('authentication', function($rootScope, $location, $http, $state) {

  this.auth = function(){
    return $http({
      method: 'GET',
      url: '/auth/isLoggedIn'
    })
    .then(function(response){
      if (response.data === 'false') {
        $state.go('login');
      }
      $rootScope.user = response.data;
    });
  };
});

app.service('getLocation', function($http, $rootScope, $q){

  this.getZip = function(){

    var deferred = $q.defer();

    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var zipQuery = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true';

      $http.get(zipQuery)
      .success(function(data){
        $rootScope.currentZip = data.results[0].address_components[7].short_name;
        deferred.resolve($rootScope.currentZip);
      });
    });

    return deferred.promise;
  };

});

//Outings service
app.service('outings', function($scope, $rootScope, $http){

});

// Notifications service
app.service('sendAlert', ['$rootScope', '$http', function ($rootScope, $http) {
  
  this.email = function(type, movie) {
    $http({
      method: 'POST',
      url: '/sendalert',
      data: JSON.stringify({
        type: type,
        userId: $rootScope.user.facebookId,
        movie: movie
      })
    })
    .success(function (data) {
    })
    .error(function (data, status, headers, config) {
      console.log('GET Error:', data, status, headers, config);
    });
  };
}]);
