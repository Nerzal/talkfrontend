doc := etree.NewDocument()

err = doc.ReadFromBytes(html)
if err != nil {
	err = errors.Wrap(err, errMessage)

	return
}
