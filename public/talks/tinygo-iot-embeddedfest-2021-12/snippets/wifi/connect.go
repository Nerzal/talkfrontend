package wifi // OMIT

import ( // OMIT
	"time" // OMIT

	"tinygo.org/x/drivers/wifinina" // OMIT
) // OMIT

func connectToAP() {
	time.Sleep(2 * time.Second)

	println("Connecting to " + ssid)

	adaptor.SetPassphrase(ssid, pass)

	for st, _ := adaptor.GetConnectionStatus(); st != wifinina.StatusConnected; {
		println("Connection status: " + st.String())
		time.Sleep(1 * time.Second)
		st, _ = adaptor.GetConnectionStatus()
	}

	println("Connected.")
}
