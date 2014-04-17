var mongoose = require('mongoose');

var user = process.env.DBUSER || '';
var pword = process.env.DBPASSWORD || '';
var domain = process.env.DBDOMAIN || '127.0.0.1';
var port = process.env.DBPORT || '';
var database = process.env.DBDATABASE || 'moviebuddy';

mongoose.connect('mongodb://' + user + ':' + pword + '@' + domain + ':' + port + '/' + database);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('MONGOD HAS AWAKENED');
});

var userSchema = mongoose.Schema({

  facebookId: { type: Number },
  facebookToken: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  city: { type: String },
  friends: { type: Array },
  outings: { type: Array },
  // invitesSent:     { type: Array },
  // invitesReceived: { type: Array },
  favTheater: { type: String },
  favGenre: { type: String },
  // favDirector:     { type: String },
  favActor: { type: String },
  favMovie: { type: String }
});

var outingSchema = mongoose.Schema({
  movie: { type: String },
  date: { type: Date },
  theater: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: Number },
  showtime: { type: String },
  // invitees:      { type: Array },
  // Example attendees: { 1001: { name: 'Alice', photo: 'alice.jpg' }, 1002: {...} }
  attendees: { type: Object },
  organizers: { type: Object, required: true }
});

exports.User = mongoose.model('User', userSchema);
exports.Outing = mongoose.model('Outing', outingSchema);

// var josh = new exports.User({
//   facebookId:     1351920892,
//   facebookToken:  '',
//   name:            'joshie boy',
//   email:           'josh@test.com',
//   city:            'New York, New York',
//   hometown:        '',
//   invitesSent:     [],
//   invitesReceived: [],
//   outings:         [],
//   friends:         [/*604502974, 578841424, 100003083891514*/],
//   favMovie:        'shawshank redemption',
//   favGenre:        'drama',
//   age:             22,
//   favTheater:      'metreon',
//   currentCity:     'san francisco',
//   favActor:        'farid siddiqi',
//   favDirector:     'farid siddiqi'
// });

// var janas = new exports.User({
//   facebookId:     604502974,
//   facebookToken:  '',
//   name:            'janas cant stand it',
//   email:           'janas@test.com',
//   city:            'Iowa, Iowan',
//   hometown:        '',
//   invitesSent:     [],
//   invitesReceived: [],
//   outings:         [],
//   friends:         [/*1351920892, 578841424, 100003083891514*/],
//   favMovie:        'star wars II',
//   favGenre:        'action',
//   age:             25,
//   favTheater:      'janasteron',
//   currentCity:     'san francisco',
//   favActor:        'farid siddiqi',
//   favDirector:     'farid siddiqi'
// });

// var fakeOuting1 = new exports.Outing({
//   movie:         'Fake Movie 1',
//   date:          '2014-05-01T00:00:00-07:00',
//   theater:       'Fake Theater 1',
//   address:       'Fake Address 1',
//   city:          'Fake City 1',
//   state:         'Fake State 1',
//   zip:           12345,
//   // invitees:      [],
//   attendeeIds:   [],
//   attendeeNames: [],
//   creatorId:     12345678,
//   creatorName:   'Fake Person 1'
// });

// fakeOuting1.save();


// var farid = new exports.User({
//   facebookId:     578841424,
//   facebookToken:  '',
//   name:            'farid wears tweed',
//   email:           'siddiqifarid@yahoo.com',
//   city:            'faridepolis, faridistan',
//   hometown:        '',
//   invitesSent:     [],
//   invitesReceived: [],
//   outings:         [],
//   friends:         [/*1351920892, 604502974, 100003083891514*/],
//   favMovie:        'Lock Stock and 2 Smoking Barrels',
//   favGenre:        'romantic',
//   age:             24,
//   favTheater:      'faruki theater',
//   currentCity:     'san francisco',
//   favActor:        'farid siddiqi',
//   favDirector:     'farid siddiqi'
// });

// var jon = new exports.User({
//   facebookId:     100003083891514,
//   facebookToken:  '',
//   name:            'jon da mon',
//   email:           'jon@test.com',
//   city:            'SoCal, SoCali',
//   hometown:        '',
//   invitesSent:     [],
//   invitesReceived: [],
//   outings:         [],
//   friends:         [/*1351920892, 604502974, 578841424*/],
//   favMovie:        'Driving Miss Daisy',
//   favGenre:        'horror',
//   age:             24,
//   favTheater:      'jonistorians theatre',
//   currentCity:     'san francisco',
//   favActor:        'farid siddiqi',
//   favDirector:     'farid siddiqi'
// });



// josh.save();
// janas.save();
// jon.save();
// farid.save();

