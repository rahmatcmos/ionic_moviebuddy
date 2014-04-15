app.controller('FriendsController', function($scope, $rootScope, getFriends) {
  var facebookId = $rootScope.user.facebookId;

  getFriends.friendsData(facebookId)
  .then(function(data){
    $scope.friends = data.data;
  });


});
