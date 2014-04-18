
app.controller('OutingsController', ['$scope', '$rootScope', '$http', '$ionicSideMenuDelegate','sendAlert', function ($scope, $rootScope, $http, $ionicSideMenuDelegate, sendAlert) {

  $scope.toggleOutingsForm = false;

  $scope.outingButtons = [
     {
       text: 'Join',
       type: 'Button',
       onTap: function(outing) {
         $scope.joinOuting(outing);
       },
       class: 'button-positive'
     },
     {
       text: 'Share',
       type: 'Button',
       onTap: function(item) {
         
       }
     }
  ];

  $scope.movies = [];
  for (var movie in $rootScope.allMovies) {
    $scope.movies.push($rootScope.allMovies[movie]);
  }

  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  var theaterField = false;
  var showtimeField = false;
  var dateField = false;

  $scope.theaters = {};
  $scope.showtimes = {};

  $scope.theaterField = function(){
    return theaterField;
  };

  $scope.showtimeField = function(){
    return showtimeField;
  };

  $scope.dateFieldDisplay = function(){
    return dateField;
  };

  var showTheaterField = function(){
    theaterField = true;
  };

  var showShowtimeField = function(){
    showtimeField = true;
  };

  var showDateField = function(){
    dateField = true;
  };

  $scope.showTheaters = function(){
    showTheaterField();
  };

  $scope.getTheaters = function(movie){
    if (movie.title !== '') {
      showDateField();
    }
    $scope.currentMovie = movie;
    for (var k = 0; k < movie.showtimes.length; k++){
      $scope.theaters[movie.showtimes[k].theatre.name] = movie.showtimes[k];
    }
  };

  $scope.getShowtimes = function(movie, theater) {
    if (theater !== '') {
      showShowtimeField();
    }
    $scope.showtimes = {};
    for (var i = 0; i < movie.showtimes.length; i++) {
      var showtime = movie.showtimes[i];
      if ($scope.theaters[showtime.theatre.name]) {
        var time = formatDate(new Date(showtime.dateTime));
        $scope.showtimes[time] = time;
      }
    }
  };

  var formatDate = function(date){

    var hour = date.getHours();
    var min = date.getMinutes();
    var ampm = 'AM';

    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    } else if (hour === 12) {
      ampm = 'PM';
    }

    if (min < 10) {
      min = '0' + min;
    }

    var time = hour + ':' + min + ampm;

    return time;
  };

  $scope.storeCurrent = function(movie) {
      $scope.currentMovie = $rootScope.allMovies[movie.toUpperCase()];
  };

  $scope.clearOutingForm = function() {
    $scope.form.movie = '';
    $scope.form.date = '';
    $scope.form.theater = '';
    $scope.form.showtime = '';

    theaterField = false;
    showtimeField = false;
    dateField = false;
  };

  // Function to create new 'outing' object from form and user.
  $scope.createOuting = function(form, userId, userName) {
    if (form === undefined || userId === undefined || userName === undefined) {
      throw new Error('Insufficient input for function.');
    }

    var outing = {};

    outing.movie = $scope.currentMovie.title;
    outing.date = form.date+'T07:00:00Z'; // Add 7 hours so angular shows correct date in THIS TIME ZONE ONLY omg fix this guyz.
    outing.theater = form.theater.theatre.name;
    outing.showtime = form.showtime;
    outing.attendees = {};
    outing.attendees[userId] = { name: userName };
    outing.organizers = {};
    outing.organizers[userId] = { name: userName };

    // sendAlert.email('creationEmail', $scope.currentMovie.title);

    return outing;
  };

  // Define empty object to hold form data.
  $scope.form = {};

  $scope.showNewOutingButton = function() {
    return newOutingButtonVisible;
  };

  $scope.showNewOutingForm = function() {
    return newOutingFormVisible;
  };

  // Function to hide 'new outing' button & show 'new outing' form.
  $scope.newOuting = function() {
    newOutingButtonVisible = false;
    newOutingFormVisible = true;
  };

  // Function to hide 'new outing' form & show 'new outing' button.
  $scope.cancelNewOuting = function() {
    newOutingFormVisible = false;
    newOutingButtonVisible = true;
  };

  // Function to process 'new outing' form.
  // Processes 'new outing' form.
  $scope.processOutingForm = function() {
    var form = $scope.form;
    var userId = $rootScope.user.facebookId;
    var userName = $rootScope.user.name;
    var outing = $scope.createOuting(form, userId, userName);
    $http({
      method: 'POST',
      url: '/api/outings',
      data: outing
    })
    .success(function (data) {
      $scope.clearOutingForm();
      $scope.cancelNewOuting();
      $scope.getOutings();
    })
    .error(function (data, status, headers, config) {
      console.log('POST Error:', data, status, headers, config);
    });
  };

  // Function to pull all 'outings' from DB for user.
  $scope.getOutings = function() {
    $http({
      method: 'GET',
      url: '/api/outings'
    })
    .success(function(data) {
      data = data.sort(function(a,b){
        return a.date - b.date;
      });
      $rootScope.outings = data;
    })
    .error(function(data, status, headers, config) {
      console.log('GET Error:', data, status, headers, config);
    });
  };

  $scope.joinOuting = function(outing) {

    var userId = $rootScope.user.facebookId;
    var userName = $rootScope.user.name;
    var outingId = outing._id;
    if(outing.attendees[userId]) {
      throw new Error('User is already attending.');
    }
    outing.attendees[userId] = { name: userName };

    $http({
      method: 'PUT',
      url: '/api/outings/' + outingId,
      data: outing
    })
    .success(function(data) {
      // sendAlert.email('joinEmail', $scope.currentMovie.title);
      $scope.getOutings();
    })
    .error(function(data, status, headers, config) {
      console.log('PUT Error:', data, status, headers, config);
    });
  };

  $scope.getMoviePoster = function(movie) {
    if (!$rootScope.allMovies) {return;}
    return $rootScope.allMovies[movie.toUpperCase()].thumbnail;
  };  

  $scope.goTo = function(movie, showtime) {
    var sTimes = $rootScope.allMovies[movie.toUpperCase()];
    for (var i = 0; i < sTimes.showtimes.length; i++) {
      var formattedTime = formatDate(new Date(sTimes.showtimes[i].dateTime));
      var sTime = sTimes.showtimes[i];
      if (showtime === formattedTime) {
        if (!sTime.ticketURI) { sTime.ticketURI = 'http://www.fandango.com'}
        window.open(sTime.ticketURI);
      }
    }
  };

  $scope.getTicket = function(movie, uri) {
    uri = uri || movie.showtimes[0].ticketURI;
    window.open(uri);
  };

  $scope.getOutings(); // Initialize display of outings.
  $scope.form = {}; // Define empty object to hold form data.

}]);