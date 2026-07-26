package main

import (
	"fmt"
	"html"
)

//START OMIT
func main() {
	// value recieved from query args
	query_msg := "<b>Evil Hacker Script!</b>"

	// Print as substitute for echoing message on Web Page
	fmt.Printf("Dangerous: \n- %s\n\n", query_msg)

	fmt.Printf("Save: \n- %s\n", html.EscapeString(query_msg)) // HL
}

//END OMIT
