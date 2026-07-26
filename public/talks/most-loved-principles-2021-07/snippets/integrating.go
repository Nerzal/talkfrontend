package main // OMIT
// OMIT
import ( // OMIT
	"context" // OMIT
	// OMIT
	"github.com/pkg/errors" // OMIT
) // OMIT

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
	// OMIT
	order.Order.ContactPartner = contactPerson // OMIT

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
