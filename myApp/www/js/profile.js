app.controller('ProfileController', function($scope, $ionicSideMenuDelegate, $rootScope, $state, updateUsers, getUsers) {

  $scope.toggleRight = function(){
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.updateUser = function(){
    updateUsers.updateUser($rootScope.user.facebookId, $rootScope.user)
    .then(function(){
      getUsers.getUser($rootScope.user.facebookId)
      .then(function(response){
        $rootScope.user = response.data;
        $ionicSideMenuDelegate.toggleRight();
      });
    });
  };

});