package main

import ( // OMIT
	"device/arm" // OMIT
	"machine"    // OMIT
	"time"       // OMIT

	"github.com/Nerzal/talks/tinygo-iot-embeddedfest/code/iot/mqttclient" // OMIT
	"github.com/Nerzal/talks/tinygo-iot-embeddedfest/code/iot/wifi"       // OMIT
	"tinygo.org/x/drivers/lsm6ds3"                                        // OMIT
	"tinygo.org/x/drivers/net/mqtt"                                       // OMIT
) // OMIT
// OMIT
func InitializeSensor() lsm6ds3.Device {
	machine.I2C0.Configure(machine.I2CConfig{})
	sensor := lsm6ds3.New(machine.I2C0)
	sensor.Configure(lsm6ds3.Configuration{})
	return sensor
}

func InitializeMQTTClient() mqtt.Client {
	wifi.Setup()
	wifi.ConnectToAP()

	client := mqttclient.NewClient()
	// OMIT
	err := mqttclient.Connect(client)
	if err != nil {
		println(err.Error())
		time.Sleep(time.Second)
		arm.SystemReset()
	}

	return client
}
