package main

func main() {
	result := loadFromPath("cats")
	println(result)
}

func loadFromPath(path string) string {
	lookupPath := "/www/website/" + path

	switch lookupPath {
	case "/www/website/cats":
		return "funny-cat.jpg" // imagine this being a io read call to the hdd
	case "/www/website/dogs":
		return "funny-fog.jpg"
	case "/www/website/secret":
		return "mySecretDatabasePasswort1234!"
	default:
		return ""
	}
}
