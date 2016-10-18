const firebase = require('firebase');
const swig  = require('swig');
const express = require('express');
const path = require('path');
const app = express();
const SerialPort = require('serialport');
let spotify = require('spotify-node-applescript');

// hack because Derek didn't buy a macbook pro
const IS_DEREK = false;
if (IS_DEREK) {
    spotify = {
        next: () => {},
        pause: () => {},
        playTrack: () => {},
        setRepeating: () => {},
        setShuffling: () => {},
        shuffleTrack: () => {},
    };
}

// setup firebase client
var config = {
    apiKey: 'AIzaSyB7XAbfFB96EceIjTDoNixssz7iXV5N18s',
    authDomain: 'projectId.firebaseapp.com',
    databaseURL: 'https://tikiav-cfcbf.firebaseio.com/',
};
firebase.initializeApp(config);

if (IS_DEREK) {
    var fogMachineSerialPort = new SerialPort('COM3', {
      baudRate: 9600,
      parser: SerialPort.parsers.readline('\n')
    });
}


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


// TODO move into fog.js

function turnOnFog() {
  fogMachineSerialPort.write('on\n');
}

function turnOffFog() {
  fogMachineSerialPort.write('off\n');
}

function isFogReady() {
  if (fogMachineSerialPort.isOpen()) {
    fogMachineSerialPort.write('state\n');
  }
}

function fogReadyLoop() {
  if (fogMachineSerialPort.isOpen()) {
    isFogReady();
  }
}

function fogForSomeTime() {
  turnOnFog();
  setTimeout(turnOffFog, 5000);
}

if (IS_DEREK) {
    fogMachineSerialPort.on('data', (data) => {
      firebase.database().ref('fogReady').set(data.trim() === 'ready');
    });

    setInterval(fogReadyLoop, 5000);
}

// setup spotify to play tiki music
const TIKI_PLAYLIST = 'spotify:user:hansoncraig:playlist:52sL5x2TQpKghH1ZZc2c53';
const EVIL_LAUGH = 'https://open.spotify.com/user/laflechej/playlist/1X75r1AlrPok99h5jH9XWh';
spotify.setRepeating(false);
spotify.setShuffling(true);
spotify.playTrack(TIKI_PLAYLIST);


// listen for fog events
firebase.database().ref('fog').on('value', snapshot => {
    if (IS_DEREK) {
       fogForSomeTime();
    }
});


// server side listening for shot events to trigger lightshow + fog
let newItems = false;
firebase.database().ref('shots').orderByKey().on('child_added', snapshot => {
    if (!newItems) {
        return;
    }

    console.log('triggering Fog Machine');
    if (IS_DEREK) {
        fogForSomeTime();
    }

    console.log('triggering Phillips Hue lightshow');
    // TODO HUE

    // play laughter - queue up music after
    console.log('triggering evil Laughter');
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
