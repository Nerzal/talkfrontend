import (
	"net/http"
	"io"

	"github.com/gobwas/ws"
)

func main() {
	http.ListenAndServe(":8080", http.HandlerFunc(handler)))
}


