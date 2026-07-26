package wifi // OMIT

import ( // OMIT
	"machine" // OMIT

	"tinygo.org/x/drivers/wifinina" // OMIT
) // OMIT

func setup() {
	spi.Configure(machine.SPIConfig{
		Frequency: 8 * 1e6,
		SDO:       machine.NINA_SDO,
		SDI:       machine.NINA_SDI,
		SCK:       machine.NINA_SCK,
		Mode:      0,
		LSBFirst:  false,
	})

	adaptor = wifinina.New(spi,
		machine.NINA_CS,
		machine.NINA_ACK,
		machine.NINA_GPIO0,
		machine.NINA_RESETN)
	adaptor.Configure()
}
