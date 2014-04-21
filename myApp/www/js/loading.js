app.controller('LoadingController', function($scope, getLocation, getTheaterData) {
  
  var authenticate = function() {
    
  }

  getLocation.getZip()
  .then(function(){
    getTheaterData.getMovies();
  });

});