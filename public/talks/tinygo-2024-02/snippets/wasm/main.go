package main

import (
	"time"
)

// This calls a JS function from Go.
func main() {
	go func(){
		for {
			println("Hello World!");
			time.Sleep(time.Second)
		}
	}()

	select {}
}

// This function is exported to JavaScript, so can be called using
// exports.add() in JavaScript.
//export add
func add(x, y int) int {
    return x + y
}