package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"notes-backend/handlers"
	"notes-backend/middleware"
)

var db *sql.DB

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Println("⚠ DATABASE_URL tidak ditemukan, menggunakan fallback docker network (db)...")
		dsn = "postgres://postgres:postgres@db:5432/notesdb?sslmode=disable"
	}

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("❌ Gagal connect ke database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("❌ Database tidak merespon:", err)
	}
	log.Println("✅ Connected to PostgreSQL")

	r := mux.NewRouter()
	r.Use(middleware.CORSMiddleware) // ✅ Tambahkan ini
	r.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	})

	// Routes
	r.HandleFunc("/register", handlers.RegisterHandler(db)).Methods("POST")
	r.HandleFunc("/login", handlers.LoginHandler(db)).Methods("POST")
	r.Handle("/notes", middleware.AuthMiddleware(http.HandlerFunc(handlers.CreateNoteHandler(db)))).Methods("POST")
	r.Handle("/notes", middleware.AuthMiddleware(http.HandlerFunc(handlers.GetNotesHandler(db)))).Methods("GET")
	r.Handle("/notes/{id}", middleware.AuthMiddleware(http.HandlerFunc(handlers.DeleteNoteHandler(db)))).Methods("DELETE")
	r.Handle("/notes/{id}", middleware.AuthMiddleware(http.HandlerFunc(handlers.UpdateNoteHandler(db)))).Methods("PUT")

	log.Println("🚀 Server running on http://localhost:8080")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal("❌ Server gagal berjalan:", err)
	}
}
