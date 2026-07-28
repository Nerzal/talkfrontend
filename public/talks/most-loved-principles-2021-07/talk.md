---
id: most-loved-principles-2021-07
title: "Princess' Most-Loved Principles and Patterns"
description: Princess Thelinger's top three favorite principles and patterns for writing maintainable Go code.
year: 2021
month: 7
tags: [go, architecture, design, patterns]
---

---
# Princess' Most-Loved Principles and Patterns
## And Why You Should Love Them Too!
Nerzal · July 2021

---
![Meme referencing Martin Luther King's "I Have a Dream" speech, captioned about clean code](assets/martin-luther-cleancode.jpg)
I also have that dream

---
# Agenda
- IOSP
- Accept interfaces, return structs
- YAGNI
- Principle of Least Astonishment

---
# IOSP
Integration Operation Segregation Principle. Segregate operations from integrations.

---
# Integration
A function calls other functions. You could also say that a function integrates other functions. "A method does not contain any logic, but only calls methods from other parts of the same codebase — then it's called integration."

---
```go
func (s *Service) onPaymentReceived(ctx context.Context, sessionID, tenant string) error {
	const errMessage = "could not handle received payment"

	order, err := s.repo.GetOrder(ctx, sessionID, tenant)
	if err != nil {
		return errors.Wrap(err, errMessage)
	}

	contactPerson, err := s.person.GetPartner(ctx, order.KeyCloakUserID)
	if err != nil {
		return errors.Wrap(err, errMessage)
	}

	err = s.Order(order.Order, tenant)
	if err != nil {
		return errors.Wrap(err, errMessage)
	}

	err = s.repo.UpdateStatus(ctx, sessionID, tenant, domain.Paid)
	if err != nil {
		return errors.Wrap(err, errMessage)
	}

	return nil
}
```

---
# Benefits
- Easy to understand
- Easy to extend
- Easy to write integration tests

---
# Operation
A function that only contains if-else, switch-case, or an API call. "A method contains only logic — i.e. transformations, control structures, or I/O, or more generally: API calls. Then it's called operation."

---
```go
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
```

---
# Benefits
- Easy to understand
- Easy to extend
- Easy to write unit tests

---
# Accept Interfaces, Return Structures
Accept interfaces and return structs in your objects. This is the idiomatic way of using interfaces in Go.

---
```go
type Repository interface {
	StoreOrderDetails(ctx context.Context, stripeID, sessionID, userID, paymentURL string, order *domain.OrderRequest) error
	UpdatePaymentURL(ctx context.Context, sessionID, tenant, paymentURL string) error
}

type Enqueueer interface {
	Send(body interface{}) error
}

type User interface {
	GetUserInfo(ctx context.Context, userID string) (userName, userMail, stripeID string, err error)
}

type Service struct {
	repo   Repository
	queuer Enqueueer
	user   User
}

func NewService(repo Repository, queuer Enqueueer, user User) *Service {
	var paymentMethodTypes = stripe.StringSlice([]string{})
	return &Service{}
}
```

---
# Benefits
- Easy to understand
- Looser coupling
- Easy to write tests
- Small interfaces

---
# You Ain't Gonna Need It
Do NOT implement things that are not exactly required.

---
- Unclear requirements
- Being ready for the future

---
# Benefits
- Code easy to understand
- Code exactly reflects the requirements
- Code easy to maintain
- Cheaper and faster development

---
# Principle of Least Astonishment
A package, a module, or a function should behave as you would expect. We do not want surprises.

--- mixed
```go
func GetOrder(orderID string) (Order, Person, error) {
	//magic
	return order, person, nil
}
```

Function name and return values mismatch.

--- mixed
```go
func (s *Service) GetOrder(orderID string) (Order, error) {
	//magic
	s.repo.DeletePerson("5") // id chosen by a fair diceroll
	//other magic
	return order, person, nil
}
```

Function name and... WTF is happening here?

---
![A honking clown horn, a visual gag about chaotic code](assets/honk.jpg)
Please don't do such things

---
# Benefits
- Easy to understand
- Looser coupling
- Easy to write tests
