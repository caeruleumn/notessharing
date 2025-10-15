package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

type NoteRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// ==================== ✅ Fungsi helper untuk ambil user_id dari token ====================
func getUserIDFromToken(r *http.Request) (int, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return 0, http.ErrNoCookie
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecret"
	}

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return 0, http.ErrNoCookie
	}

	claims := token.Claims.(jwt.MapClaims)
	return int(claims["user_id"].(float64)), nil
}

// ==================== ✅ CREATE NOTE ====================
func CreateNoteHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var req NoteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Title == "" {
			http.Error(w, "Invalid note payload", http.StatusBadRequest)
			return
		}

		_, err = db.Exec("INSERT INTO notes (user_id, title, content, created_at) VALUES ($1, $2, $3, $4)",
			userID, req.Title, req.Content, time.Now())
		if err != nil {
			http.Error(w, "Failed to create note", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"Note created successfully"}`))
	}
}

// ==================== ✅ GET ALL NOTES ====================
type Note struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UserID    int       `json:"user_id"`
	Username  string    `json:"username"`
}

func GetNotesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := getUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		rows, err := db.Query(`
			SELECT notes.id, notes.title, notes.content, notes.created_at, notes.user_id, users.username
			FROM notes
			JOIN users ON users.id = notes.user_id
			ORDER BY notes.id DESC
		`)
		if err != nil {
			http.Error(w, "Failed to fetch notes", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var notes []Note
		for rows.Next() {
			var note Note
			if err := rows.Scan(&note.ID, &note.Title, &note.Content, &note.CreatedAt, &note.UserID, &note.Username); err == nil {
				notes = append(notes, note)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(notes)
	}
}

// ==================== ✅ DELETE NOTE ====================
func DeleteNoteHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		noteID := mux.Vars(r)["id"]

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM notes WHERE id = $1", noteID).Scan(&ownerID)
		if err != nil {
			http.Error(w, "Note not found", http.StatusNotFound)
			return
		}

		if ownerID != userID {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		db.Exec("DELETE FROM notes WHERE id = $1", noteID)
		w.Write([]byte(`{"message":"Note deleted successfully"}`))
	}
}

// ==================== ✅ UPDATE NOTE ====================
func UpdateNoteHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		noteID := mux.Vars(r)["id"]

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM notes WHERE id = $1", noteID).Scan(&ownerID)
		if err != nil || ownerID != userID {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		var req NoteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Title == "" {
			http.Error(w, "Invalid note payload", http.StatusBadRequest)
			return
		}

		db.Exec("UPDATE notes SET title = $1, content = $2 WHERE id = $3", req.Title, req.Content, noteID)
		w.Write([]byte(`{"message":"Note updated successfully"}`))
	}
}
