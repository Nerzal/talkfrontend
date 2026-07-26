elements := doc.FindElements("//a[@class='dokumentList']")
for i := range elements {
	element := elements[i]
	childElements := element.ChildElements()

	if len(childElements) == 0 {
		continue
	}

	child := childElements[0]

	switch child.Text() {
	case "AD":
		adActionID = element.SelectAttr("id").Value
	case "CD":
		chronoActionID = element.SelectAttr("id").Value
	case "HD":
		historicalActionID = element.SelectAttr("id").Value
	case "DK":
		dkActionID = element.SelectAttr("id").Value
	case "UT":
	case "VÖ":
	case "SI":
	}
}
