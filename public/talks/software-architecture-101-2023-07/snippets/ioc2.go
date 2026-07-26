import (
	"github.com/insane/tobi/sql" 
)

type Repository struct {
	dbConnection *sql.DB
}

// Inject dependency
func NewRepository(dbConnection *sql.DB) *Repository {
	return &Repository{
        dbConnection: dbConnection,
    }
}