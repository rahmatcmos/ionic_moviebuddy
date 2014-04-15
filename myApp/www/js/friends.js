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
        if (this.text === 'Remove') {
          delete $scope.currentFriendsSelected[item.facebookId];
          this.text = 'Add';
        } else {
          $scope.currentFriendsSelected[item.facebookId] = item;
          this.text = 'Remove';
        }
        
      }
    }
  ];

});
