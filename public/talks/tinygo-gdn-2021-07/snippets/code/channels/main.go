package main

func main() {
	myChannel := make(chan int)

	go asyncFunction(myChannel)

	for {
		println(<-myChannel)
	}
}

func asyncFunction(myChannel chan int) {
	i := 0
	for {
		myChannel <- i
		i++
	}
}
