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
app.service('getMoviesData', function($http, $rootScope){
  var rottenTomatoesUrl = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?callback=JSON_CALLBACK&apikey=63za93cgdtv88ves8p6d9wrk';
  var pageLimitQuery = '&page_limit=';
  var pageQuery = '&page=';

  var totalMovies;
  var totalQueryPages;
  this.allMovies = [];

  this.getMovieData = function(queryPage, queryPageLimit) {
    var that = this;
    var query = rottenTomatoesUrl + pageLimitQuery + queryPageLimit + pageQuery + queryPage;
    return $http.jsonp(query)
    .success(function(data){
      totalMovies = data.total;
      totalQueryPages = Math.ceil(totalMovies / queryPageLimit);

      that.allMovies = that.allMovies.concat(data.movies);
      $rootScope.allMovies = that.allMovies;
      queryPage++;

      if (queryPage <= totalQueryPages) {
        that.getMovieData(queryPage, queryPageLimit);
      }
    });
  };

});

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
  // var cookieParser = function(cookie) {
  //   var splitCookie = cookie.split(';');
  //   for (var i = 0; i < splitCookie.length; i++){
  //     var leftSide = splitCookie[i].split('=')[0];
  //     var rightSide = splitCookie[i].split('=')[1];
  //     if( rightSide === 'undefined') {
  //       return JSON.parse(leftSide);
  //     }
  //   }
  // };

  this.auth = function(){
    return $http({
      method: 'GET',
      url: '/auth/isLoggedIn'
    })
    .then(function(response){
      console.log(response);
      if (response.data === 'false') {
        $state.go('login');
      }
      $rootScope.user = response.data;
    });
  };
});