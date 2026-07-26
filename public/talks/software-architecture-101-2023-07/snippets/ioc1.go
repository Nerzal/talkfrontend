import (
	"github.com/insane/tobi/sql"
)

type Repository struct {
	dbConnection *sql.DB 
}

func NewRepository() *Repository {
	return &Repository{
        dbConnection: sql.NewDBConnection()
    }
}