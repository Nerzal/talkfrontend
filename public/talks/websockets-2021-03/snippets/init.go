package main

import (
	"net"

	"github.com/gobwas/ws"
)

func main() {
	// init
	listener, err := net.Listen("tcp", "127.0.0.1:1337")
	if err != nil {
		println(err.Error())
	}

	conn, err := listener.Accept()
	if err != nil {
		println(err.Error())
	}

	upgrader := ws.Upgrader{}
	if _, err = upgrader.Upgrade(conn); err != nil {
		println(err.Error())
	}
}
