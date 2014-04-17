
app.controller('OutingsController', ['$scope', '$rootScope', '$http', '$ionicSideMenuDelegate', function ($scope, $rootScope, $http, $ionicSideMenuDelegate) {

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

  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  var theaterField = false;
  var showtimeField = false;

  $scope.theaters = {};
  $scope.showtimes = [];

  $scope.theaterField = function(){
    return theaterField;
  };

  $scope.showtimeField = function(){
    return showtimeField;
  };

  var showTheaterField = function(){
    theaterField = true;
  };

  var showShowtimeField = function(){
    showtimeField = true;
  };
  

  $scope.getTheaters = function(movie){
    if (movie.title !== '') {
      showTheaterField();
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
    $scope.showtimes = [];
    for (var i = 0; i < movie.showtimes.length; i++) {
      var showtime = movie.showtimes[i];
      if ($scope.theaters[showtime.theatre.name]) {
        var time = formatDate(new Date(showtime.dateTime));
        $scope.showtimes.push(time);
      }
    }
  };

  var formatDate = function(date){
    var hr = date.getHours();
    var min = date.getMinutes();
    var ampm = 'AM';

    if (hr > 12) {
      hr = hr - 12;
      ampm = 'PM';
    } else if (hr === 12) {
      ampm = 'PM';
    }

    if (min < 10) {
      min = '0' + min;
    }

    var time = hr + ':' + min + ampm;

    return time;
  };

  $scope.storeCurrent = function(movie) {
    for (var i = 0; i < $rootScope.allMovies.length; i++) {
      if (movie === $rootScope.allMovies[i].title) {
        $scope.currentMovie = $rootScope.allMovies[i];
      }
    }
  };

  var newOutingButtonVisible = true;
  var newOutingFormVisible = false;

  // Rewrite using angular.forEach()?
  $scope.clearOutingForm = function() {
    $scope.form.movie = '';
    $scope.form.date = '';
    $scope.form.theater = '';
    $scope.form.showtime = '';
    // $scope.form.invitees = '';
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
      console.log(data);
      $rootScope.outings = data;
    })
    .error(function(data, status, headers, config) {
      console.log('GET Error:', data, status, headers, config);
    });
  };

  $scope.showJoinButton = function() {
    var userId = $rootScope.user.facebookId;
    for(var attendeeId in this.outing.attendees) {
      if(Number(attendeeId) === Number(userId)) {
        return false;
      }
    }
    return true;
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
      console.log('PUT Success:', data);
      $scope.getOutings();
    })
    .error(function(data, status, headers, config) {
      console.log('PUT Error:', data, status, headers, config);
    });
  };

  $scope.showEditButton = function() {
    var userId = $rootScope.user.facebookId;
    var outing = this.outing;

    for (var organizerId in outing.organizers) {
      if (Number(organizerId) === Number(userId)) {
        return true;
      }
    }

    return false;
  };

  $scope.editOuting = function() {
    var outing = this.outing;
    var outingId = this.outing._id;

    $http({
      method: 'PUT',
      url: '/api/outings/' + outingId,
      data: outing
    });
  };

  $scope.getOutings(); // Initialize display of outings.
  $scope.form = {}; // Define empty object to hold form data.

}]);