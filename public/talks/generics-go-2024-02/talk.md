---
id: generics-go-2024-02
title: Go Generics
description: A look at what Go's generics support offers, and how the new generic standard library packages simplify code that used to need workarounds.
year: 2024
month: 2
tags: [go, generics]
---

--- title
# Go Generics
## Introduction to generics in Go
Nerzal · Februar 2024

--- content
# Agenda
- A brief history of generics in Go

--- blank
# History
Starting with version 1.18, Go has added support for generics, also known as type parameters. What have Go devs done before 1.18?

--- mixed
# Prior 1.18
- Use workarounds with interfaces, reflection, code generation
- Implement the same function over and over again for other types
```go
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
```

--- code
# Now → NOW! → NOW!!!111elf
```go
package main

func main(){
	numbers := []int{1, 2, 6, 4, 5, 3}
	println(max(numbers))
}

func max[T ~float32 | ~float64 | int](numbers []T) T {
	max := numbers[0]

    for _, n := range numbers {
        if n > max {
            max = n
        }
    }

    return max
}
```
```go
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
```
```go
package main

import "slices"

func main(){
	numbers := []int{1, 2, 6, 4, 5, 3}
	println(slices.Max(numbers))
}
```
