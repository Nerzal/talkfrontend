func receive(conn net.Conn) {
	reader := wsutil.NewReader(conn, ws.StateServerSide)
	// receive message
	for {
		_, err := reader.NextFrame()
		if err != nil {
			// handle error
		}

		data, err := ioutil.ReadAll(reader)
		if err != nil {
			// handle error
		}

		println(string(data))
	}
}   