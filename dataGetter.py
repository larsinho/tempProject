import time


def getTemp():
    try:
        tempfile_in = open("/sys/bus/w1/devices/28-0308979407dd/w1_slave")
        tempText_in = tempfile_in.read()
        tempfile_in.close()
        tempCelsius_in = tempText_in.split("\n")[1].split(" ")[9]
        degrees_in = float(tempCelsius_in[2:]) / 1000
        print(degrees_in)

        tempfile_out = open("/sys/bus/w1/devices/28-030897942b98/w1_slave")
        tempText_out = tempfile_out.read()
        tempfile_out.close()
        tempCelsius_out = tempText_out.split("\n")[1].split(" ")[9]
        degrees_out = float(tempCelsius_out[2:]) / 1000
        print(degrees_out)
        return degrees_in, degrees_out
    except:
        return "error", time.time()
    