package mqttclient

import ( // OMIT
	// OMIT
	"device/arm" // OMIT
	"fmt"        // OMIT
	"time"       // OMIT

	"tinygo.org/x/drivers/net/mqtt" // OMIT
	"tinygo.org/x/drivers/wifinina" // OMIT
) // OMIT
// OMIT
func PublishMessage(client mqtt.Client, temp int32) {
	println("sending message") // OMIT

	message := fmt.Sprintf(`{value: %v}`, temp/1000)
	token := client.Publish("embeddedfest/tinygo/iot/temperature", 1, false, message)
	token.Wait()

	err := token.Error()
	if err != nil {
		switch t := err.(type) {
		case wifinina.Error:
			println(t.Error(), "attempting to reboot..")
			time.Sleep(time.Second)
			arm.SystemReset()
		default:
			println(err.Error())
		}
	}
}
