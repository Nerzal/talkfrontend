func handleConnection(conn net.Conn) {
	defer conn.Close()

	state := ws.StateServerSide
	reader := wsutil.NewReader(conn, state)
	writer := wsutil.NewWriter(conn, state, ws.OpText)

	for {
		header, err := reader.NextFrame()
		if err != nil {
			// handle error
		}

		// Reset writer to write frame with right operation code.
		writer.Reset(conn, state, header.OpCode)

		if _, err = io.Copy(writer, reader); err != nil {
			// handle error
		}
		if err = writer.Flush(); err != nil {
			// handle error
		}
	}
}