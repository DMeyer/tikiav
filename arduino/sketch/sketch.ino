
// Pin Definitions
const int RELAY_PIN = 5;
const int HEATER_READY_PIN = 2;

// Global Variables
String command;

void setup() {

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(HEATER_READY_PIN, INPUT);
  
  Serial.begin(9600);
}

void loop() {
  
  while(Serial.available() > 0) {
    command = Serial.readStringUntil('\n');

    if (command.equals("state")) {
      if (isReady()) {
        Serial.println("ready");
      } else {
        Serial.println("heating");
      } 
    }

    if (command.equals("on")) {
      enableFog();
    }

    if (command.equals("off")) {
      disableFog();
    }
  }
}

bool isReady() {
  return digitalRead(HEATER_READY_PIN) == HIGH;
}

void enableFog() {
  digitalWrite(RELAY_PIN, HIGH);
}

void disableFog() {
  digitalWrite(RELAY_PIN, LOW);
}
