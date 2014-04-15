app.controller('FriendsController', function($scope, $rootScope, getFriends) {
  var facebookId = $rootScope.user.facebookId;

  getFriends.friendsData(facebookId)
  .then(function(data){
    $scope.friends = data.data;
  });

  $scope.currentFriendsSelected = {};

  $scope.itemButtons = [
    {
      text: 'Add',
      type: 'Button',
      onTap: function(item) {
        $scope.currentFriendsSelected[item.facebookId] = item;
      }
    }
  ];

});
