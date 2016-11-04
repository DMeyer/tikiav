const firebase = require('firebase');
const swig  = require('swig');
const express = require('express');
const path = require('path');
const app = express();
const hue = require('./hue.js');
const fog = require('./fog.js');
let spotify = require('spotify-node-applescript');

// hack because Derek didn't buy a macbook pro
const ENABLE_FOG = true;
const ENABLE_SPOTIFY = true;
if (!ENABLE_SPOTIFY) {
    spotify = {
        next: () => {},
        pause: () => {},
        playTrack: () => {},
        setRepeating: () => {},
        setShuffling: () => {},
        shuffleTrack: () => {},
        setVolume: () => {},
    };
}

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
/* const TIKI_PLAYLIST = 'spotify:user:hansoncraig:album:7kbE1OA1V1e0jrxbAXTS03'; */
const EVIL_LAUGH = 'https://open.spotify.com/user/laflechej/playlist/1X75r1AlrPok99h5jH9XWh';
spotify.setRepeating(false);
spotify.setShuffling(true);
spotify.playTrack(TIKI_PLAYLIST);
spotify.setVolume(50);

// setup lights
hue.startNormalFlow();

// setup fog
if (ENABLE_FOG) {
    fog.monitorFog((data) => {
        console.log('fog' + data);
        firebase.database().ref('fogReady').set(data.trim() === 'ready');
    });
}

// listen for fog events
firebase.database().ref('fog').on('value', snapshot => {
    if (!newItems) {
        return;
    }

    if (ENABLE_FOG) {
       fog.fogForSomeTime();
    }
});


// server side listening for shot events to trigger lightshow + fog
let newItems = false;
firebase.database().ref('shots').orderByKey().on('child_added', snapshot => {
    if (!newItems) {
        return;
    }

    // play laughter - queue up music after
    console.log('triggering evil Laughter');
    spotify.setVolume(100);
    spotify.playTrack(EVIL_LAUGH);

    console.log('triggering Fog Machine');
    if (ENABLE_FOG) {
        fog.fogForSomeTime();
    }

    console.log('triggering Phillips Hue lightshow');
    hue.startShotFlow();

    setTimeout(() => {
        spotify.setVolume(50);
        spotify.playTrack(TIKI_PLAYLIST);
        spotify.next();
        hue.startNormalFlow();
    }, 9000);
});

firebase.database().ref('shots').once('value', function(messages) {
      newItems = true;
});
