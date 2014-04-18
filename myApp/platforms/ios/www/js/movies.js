app.controller('MoviesController', function ($scope, $http) {

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

  $scope.goTo = function(movie, url) {
    var url = url || movie.showtimes[0].ticketURI;
    window.open(url);
  };

});


app.controller('MovieInfoController', function($scope){
  $scope.textLimit = 80;
  $scope.moreText = '...';

  $scope.toggleText = function(text){
    if (!text) { text = ' '; }
    $scope.textLimit = $scope.textLimit === 80 ? $scope.textLimit = text.length : $scope.textLimit = 80;
    $scope.moreText =  $scope.moreText === '...'? $scope.moreText = '' : $scope.moreText = '...';
  };
});