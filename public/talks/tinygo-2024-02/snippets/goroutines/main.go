package main

import "time"

func main() {
	go func() {
		for {
			println("i'm happily executed by a goroutine")
			time.Sleep(time.Second)
		}
	}()

	select {}
}
