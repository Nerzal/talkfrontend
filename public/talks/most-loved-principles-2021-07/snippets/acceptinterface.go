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