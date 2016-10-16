const request = require('request');
const firebase = require('firebase');
const swig  = require('swig');
const express = require('express');
const path = require('path');
const app = express();
const spotify = require('spotify-node-applescript');


// setup firebase client
var config = {
    apiKey: 'AIzaSyB7XAbfFB96EceIjTDoNixssz7iXV5N18s',
    authDomain: 'projectId.firebaseapp.com',
    databaseURL: 'https://tikiav-cfcbf.firebaseio.com/',
};
firebase.initializeApp(config);

// static files in 'static' directory
app.use('/static', express.static('static'));

// we use the 'swig' template engine for rendering files
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
swig.setDefaults({
    cache: false
});

app.get('/', function (req, res) {
    res.render('shot.html');
});

app.get('/admin', function (req, res) {
    res.render('admin.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});



// setup spotify to play tiki music
const TIKI_PLAYLIST = 'spotify:user:hansoncraig:playlist:52sL5x2TQpKghH1ZZc2c53';
const EVIL_LAUGH = 'https://open.spotify.com/user/laflechej/playlist/1X75r1AlrPok99h5jH9XWh';
spotify.setRepeating(false);
spotify.setShuffling(true);
spotify.playTrack(TIKI_PLAYLIST);

// server side listening for shot events to trigger lightshow + fog
let newItems = false;
firebase.database().ref('shots').orderByKey().on('child_added', snapshot => {
    if (!newItems) {
        return;
    }

    // TODO implement
    console.log('triggering Phillips Hue lightshow');
    console.log('triggering Fog Machine');

    console.log('triggering evil Laughter');
    spotify.pause();
    setTimeout(() => {
        spotify.playTrack(EVIL_LAUGH);
    }, 1000);

    setTimeout(() => {
        spotify.playTrack(TIKI_PLAYLIST);
        spotify.next();
    }, 9000);
});

firebase.database().ref('shots').once('value', function(messages) {
      newItems = true;
});
