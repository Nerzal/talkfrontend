type dbConnection interface {
	Get() (*Data, error)
	Save(data Data) error
}

type Repository struct {
	dbConnection dbConnection
}

// Inject dependency
func NewRepository(dbConnection dbConnection) *Repository {
	return &Repository{
        dbConnection: dbConnection,
    }
}