app.controller('MoviesController', function ($scope, $http, getMoviesData) {

  var queryPage = 1;
  var queryPageLimit = 50;

  // $scope.allMovies = $rootScope.allMovies;


  // var getMovies = function(queryPage, queryPageLimit) {
  //   getMoviesData.getMovieData(queryPage, queryPageLimit)
  //   .then(function(){
  //     $scope.allMovies = getMoviesData.allMovies;
  //   });
  // };

  // getMovies(queryPage, queryPageLimit);
  $scope.movieButtons = [
     {
       text: 'Create Outing',
       type: 'Button',
       onTap: function(item) {
         alert('Edit Item: ' + item.id);
       },
       class: 'button-positive'
     }
  ];
});


app.controller('SynopsisController', function($scope){
  $scope.textLimit = 40;
  $scope.moreText = '...';

  $scope.toggleText = function(text){
    if (!text) { text = ' '; }
    $scope.textLimit = $scope.textLimit === 40 ? $scope.textLimit = text.length : $scope.textLimit = 40;
    $scope.moreText =  $scope.moreText === '...'? $scope.moreText = '' : $scope.moreText = '...';
  };
});

app.controller('CriticsController', function($scope){
  $scope.textLimit = 40;
  $scope.moreText = '...';

  $scope.toggleText = function(text){
    if (!text) { text = ' '; }
    $scope.textLimit = $scope.textLimit === 40 ? $scope.textLimit = text.length : $scope.textLimit = 40;
    $scope.moreText =  $scope.moreText === '...' ? $scope.moreText = '' : $scope.moreText = '...';
  };
});