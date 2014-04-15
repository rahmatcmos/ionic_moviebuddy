app.controller('MoviesController', function ($scope, $http, getMoviesData) {

  var queryPage = 1;
  var queryPageLimit = 50;

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


app.controller('MovieInfoController', function($scope){
  $scope.textLimit = 80;
  $scope.moreText = '...';

  $scope.toggleText = function(text){
    if (!text) { text = ' '; }
    $scope.textLimit = $scope.textLimit === 80 ? $scope.textLimit = text.length : $scope.textLimit = 80;
    $scope.moreText =  $scope.moreText === '...'? $scope.moreText = '' : $scope.moreText = '...';
  };
});