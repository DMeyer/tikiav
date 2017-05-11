"use strict";

const huejay = require('huejay');

const client = new huejay.Client({
  host: '192.168.1.72',
  port: 80,         // Optional
  username: 'wJPwFjdRq32Fzj60fdfjkP9c0Wg4Hfu9GKxxaceI', // Optional
});

// const darkMagenta = [0.3787,0.1724];
// const darkViolet = [0.2742,0.1326];
// const darkGreen = [0.214,0.709]
// const lightGreen = [0.2648,0.4901];
// const purple = [0.2703,0.1398];
// const slateBlue = [0.2218,0.1444];
// const crimson = [0.6531,0.2834];
// const darkRed = [0.7,0.2986];
// const black = [0.139,0.081];
// const webMaroon = [0.7,0.2986];  // we like this one
// const derekPurple = [0.2285, 0.0845];
// const derekGreen = [0.214,0.709];
const derekPink = [0.6063, 0.2908];
const derekOrange = [0.5783, 0.3922];
const orangeRed = [0.6726, 0.3217]; // volcano
const derekIndigo = [0.1684, 0.0416];

const colors = [
  derekPink,
  orangeRed,
  derekIndigo,
  derekOrange,
];


let isShotMode = false;
function normalFlow() {
  if (isShotMode) {
    return;
  }

  const id = Math.floor(Math.random() * 4) + 1;
  const color = colors[Math.floor(Math.random() * colors.length)];

  client.lights.getById(id).then((light) => {
    light.xy = color;
    light.effect = 'none';
    light.brightness = 50;
    light.transitionTime = 1 + Math.floor(Math.random() * 3);
    return client.lights.save(light);
  }).then(() => {
    setTimeout(normalFlow, 1000);
  }).catch((error) => {
    console.log('Something went wrong');
    console.log(error.stack);
  });
}

var red = true;
function shotSequence() {
  if (!isShotMode) {
    return;
  }
  client.lights.getAll().then((lights) => {
    for (const light of lights) {
      light.brightness = red ? 200 : 0;
      light.transitionTime = 0.2;
      client.lights.save(light);
    }
    red = !red;
    setTimeout(shotSequence, 200);
  }).catch((error) => {
    console.log('Something went wrong');
    console.log(error.stack);
  });
}

function startNormalFlow() {
  isShotMode = false;
  normalFlow();
}

function startShotFlow() {
  isShotMode = true;
  red = true;
  shotSequence();
}

function setupHueUser() {
  const setupClient = new huejay.Client({
    host: '192.168.1.72',
    port: 80,         // Optional
    timeout: 15000,            // Optional, timeout in milliseconds (15000 is the default)
  });
  const user = new setupClient.users.User();

  setupClient.users.create(user)
    .then((createdUser) => {
      console.log(`New user created - Username: ${createdUser.username}`);
    })
    .catch((error) => {
      if (error instanceof huejay.Error && error.type === 101) {
        console.log('Link button not pressed. Try again...');
      }
      console.log(error.stack);
    });
}

exports.startNormalFlow = startNormalFlow;
exports.startShotFlow = startShotFlow;
exports.setupHueUser = setupHueUser;
