const huejay = require('huejay');
const client = new huejay.Client({
  host:     '192.168.1.65',
  port:     80,               // Optional
  username: '1FVRvaGwCnNfD7mTJJzBXwtCBSbObVhVIRHFStol', // Optional
});

const darkMagenta = [0.3787,0.1724];
const darkViolet = [0.2742,0.1326];
const darkGreen = [0.214,0.709]
const lightGreen = [0.2648,0.4901];
const purple = [0.2703,0.1398];
const slateBlue = [0.2218,0.1444];
const crimson = [0.6531,0.2834];
const darkRed = [0.7,0.2986];
const black = [0.139,0.081];
const webMaroon = [0.7,0.2986];  // we like this one
const orangeRed = [0.6726,0.3217]; // volcanoo
const derekPink = [ 0.6063, 0.2908];
const derekIndigo = [0.1684, 0.0416];
const derekOrange = [0.5783, 0.3922];
const derekPurple = [0.2285, 0.0845];
const derekGreen = 	[0.214,0.709];

const colors = [
    /* derekPink, */
    orangeRed,
    derekIndigo,
    /* derekOrange */
];



let isShotMode = false;
function normalFlow() {
    /* if (isShotMode) { */
    /*     return; */
    /* } */
    id = Math.floor(Math.random() * 3) + 1
    color = colors[Math.floor(Math.random() * colors.length)];
    
    client.lights.getById(id).then(light => {
        light.xy = color;
        light.effect = 'none';
        light.brightness = 50;
        light.colorMode = 'xy';
        light.transitionTime = 1 + Math.floor(Math.random() * 3);
        /* console.log(light.xy); */
        return client.lights.save(light);
      }).then(light => {
        setTimeout(normalFlow, 1000);
      }).catch(error => {
        console.log('Something went wrong');
        console.log(error.stack);
      });
}

let red = true;
function shotSequence() {
    if (!isShotMode) {
        return;
    }
    client.lights.getAll().then(lights => {
        for (let light of lights) {
            light.brightness = red ? 200 : 0;
            light.transitionTime = 0.2;
            client.lights.save(light);
        }
        red = !red;
        setTimeout(shotSequence, 200);
    }).catch(error => {
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

exports.startNormalFlow = startNormalFlow;
exports.startShotFlow = startShotFlow;

/* const stdin = process.stdin; */
/* let x = 0.0; */
/* let y = 0.0; */

/* stdin.on( 'data', function(key){ */
/*     if (key == 'w') { */
/*         y += 0.01; */
/*     } else if (key == 's') { */
/*         y -= 0.01; */
/*     } else if (key == 'a') { */
/*         x -= 0.01; */
/*     } else if (key == 'd') { */
/*         x += 0.01; */
/*     } */

/*     client.lights.getAll().then(lights => { */
/*         for (let light of lights) { */
/*             light.xy = [x, y]; */
/*             light.brightness = 125; */
/*             client.lights.save(light); */
/*         } */
/*     }); */

/*     process.stdout.clearLine();  // clear current text */
/*     process.stdout.cursorTo(0);  // move cursor to beginning of line */
/*     console.log(`[${x}, ${y}]`); */
/* }); */


derekIndigo
