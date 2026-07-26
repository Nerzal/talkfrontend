package mqttclient

import ( // OMIT
	"tinygo.org/x/drivers/net/mqtt" // OMIT
) // OMIT
// OMIT
const server = "tcp://noobygames.de:1883"

func NewClient() mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(server).SetClientID("tinygo-iot-" + randomString(8))

	client := mqtt.NewClient(opts)

	return client
}

func Connect(client mqtt.Client) error {
	println("Connecting to MQTT...")

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	println("successfully connected")
	return nil
}
