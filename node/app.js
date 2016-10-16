var firebase = require('firebase');
var swig  = require('swig');
var express = require('express');
var path = require('path');
var app = express();

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


// server side listening for shot events to trigger lightshow + fog

let newItems = false;
firebase.database().ref('shots').orderByKey().on('child_added', snapshot => {
    if (!newItems) {
        return;
    }

    // TODO implement
    console.log('triggering Phillips Hue lightshow');
    console.log('triggering Fog Machine');
});

firebase.database().ref('shots').once('value', function(messages) {
      newItems = true;
});
