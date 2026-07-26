package main

func main(){
	numbers := []int{1, 2, 6, 4, 5, 3}
	println(maxInt(numbers))
}

func maxInt(numbers []int) int {
	max := numbers[0]

    for _, n := range numbers {
        if n > max {
            max = n
        }
    }

    return max
}