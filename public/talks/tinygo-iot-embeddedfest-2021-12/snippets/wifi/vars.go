package wifi

import (
	"machine"

	"tinygo.org/x/drivers/wifinina"
)

// access point info
const ssid = "example_wifi"
const pass = "secure1234"

var (
	spi     = machine.NINA_SPI
	adaptor *wifinina.Device
)
