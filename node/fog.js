const SerialPort = require('serialport');

const PORT = '/dev/cu.usbserial-A9007QmY';
let fogMachineSerialPort = null;
function fogMachine() {
    if (!fogMachineSerialPort) {
        fogMachineSerialPort = new SerialPort(PORT, {
          baudRate: 9600,
          parser: SerialPort.parsers.readline('\n')
        });
    }

    return fogMachineSerialPort;
}


function turnOnFog() {
  fogMachine().write('on\n');
}

function turnOffFog() {
  fogMachine().write('off\n');
}

function isFogReady() {
  if (fogMachine().isOpen()) {
    fogMachine().write('state\n');
  }
}

function fogReadyLoop() {
  if (fogMachine().isOpen()) {
    isFogReady();
  }
}

function fogForSomeTime() {
  turnOnFog();
  setTimeout(turnOffFog, 5000);
}


function monitorFog(callback) {

    fogMachine().on('data', (data) => {
      callback(data);
    });

    setInterval(isFogReady, 5000);
}

exports.monitorFog = monitorFog;
exports.fogForSomeTime = fogForSomeTime;
