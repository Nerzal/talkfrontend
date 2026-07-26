func mapMonitoring(response *monitoring.StatusResponse) (*Monitoring, error) {
	const errMessage = "could not map monitoring status"

	var result Monitoring

	result.IsUnlimitedMonitoring = true

	if response.EndDate != "" {
		endDate, err := time.Parse("01.02.2006", response.EndDate)
		if err != nil {
			return nil, errors.Wrap(err, errMessage)
		}

		result.MonitoringEndDate = endDate.Format("2006-01-02")
		result.IsUnlimitedMonitoring = false
	}

	result.LanguageCodeISO = "DE"
	result.ProductCode = response.Package

	return &result, nil
}