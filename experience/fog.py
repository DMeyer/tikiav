from django.conf import settings

import serial

# ser = serial.Serial(
#     port=settings.FOG_SERIAL_PORT,
#     baudrate=settings.FOG_SERIAL_BAUDRATE,
#     parity=serial.PARITY_ODD,
#     stopbits=serial.STOPBITS_TWO,
#     bytesize=serial.SEVENBITS
# )


def startFog(duration):
    if duration <= 0:
        return
    print('fogOn ' + str(duration))
    # ser.write('fogOn ' + str(duration))


def stopFog():
    print('fogOff')
    # ser.write('fogOff')
