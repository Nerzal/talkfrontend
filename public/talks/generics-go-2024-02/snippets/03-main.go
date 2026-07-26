package main

import "golang.org/x/exp/constraints"

func main(){
	numbers := []int{1, 2, 6, 4, 5, 3}
	println(max(numbers))
}

func max[T constraints.Ordered](numbers []T) T {
	max := numbers[0]

    for _, n := range numbers {
        if n > max {
            max = n
        }
    }

    return max
}