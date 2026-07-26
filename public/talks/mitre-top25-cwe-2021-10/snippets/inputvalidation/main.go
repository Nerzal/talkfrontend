package main

import "errors"

const price = 100

func main() {
	chargeUserAccount(10)
}

func chargeUserAccount(amount int) error {
	if amount > 100000 {
		return errors.New("what are u doin?!")
	}

	value := amount * price
	println("user is charged:", value, "€")
	return nil
}
