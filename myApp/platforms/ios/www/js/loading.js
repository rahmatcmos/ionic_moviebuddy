app.controller('LoadingController', function($scope, getLocation, getTheaterData) {
  

  getLocation.getZip()
  .then(function(){
    getTheaterData.getMovies();
  });

});