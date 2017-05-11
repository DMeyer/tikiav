"use strict";

const firebase = require('firebase');
const swig = require('swig');
const express = require('express');
const path = require('path');
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
const config = {
  apiKey: 'AIzaSyB7XAbfFB96EceIjTDoNixssz7iXV5N18s',
  authDomain: 'projectId.firebaseapp.com',
  databaseURL: 'https://tikiav-cfcbf.firebaseio.com/',
};
firebase.initializeApp(config);


// setup spotify to play tiki music
const TIKI_PLAYLIST = 'spotify:user:laflechej:playlist:0xlZoD94o1T74TfwXdG0Ep';
const EVIL_LAUGH = 'https://open.spotify.com/user/laflechej/playlist/1X75r1AlrPok99h5jH9XWh';


function startDevices() {
  spotify.setRepeating(false);
  spotify.setShuffling(true);
  spotify.playTrack(TIKI_PLAYLIST);
  spotify.setVolume(50);

  // setup lights
  hue.startNormalFlow();

  // setup fog
  if (ENABLE_FOG) {
    fog.monitorFog((data) => {
      console.log(`fog ${data}`);
      firebase.database().ref('fogReady').set(data.trim() === 'ready');
    });
  }
}


function setupServer() {
  const app = express();

  // static files in 'static' directory
  app.use('/static', express.static('static'));

  // we use the 'swig' template engine for rendering files
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '/views'));
  swig.setDefaults({
    cache: false,
  });

  app.get('/', (req, res) => {
    res.render('shot.html');
  });

  app.get('/admin', (req, res) => {
    res.render('admin.html');
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Example app listening on port 3000!');
  });
}


function firebaseListeners() {
  let newItems = false;


  // listen for fog events
  firebase.database().ref('fog').on('value', () => {
    if (!newItems) {
      return;
    }

    if (ENABLE_FOG) {
      fog.fogForSomeTime();
    }
  });

  // listen for shot events to trigger lightshow + fog
  firebase.database().ref('shots').orderByKey().on('child_added', () => {
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
    }, 8000);
  });

  firebase.database().ref('shots').once('value', () => {
    newItems = true;
  });
}

startDevices();
firebaseListeners();
setupServer();
// hue.setupHueUser()
