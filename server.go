package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type slide struct {
	SlideID   int    `db:"slide_id" json:"slideId"`
	SlideInfo string `db:"slide_info" json:"slideInfo"`
}

var db *sqlx.DB

func main() {

	connStr := fmt.Sprintf("user=postgres dbname=reactdb port=5432 sslmode=disable")

	var err error
	db, err = sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatal(err)
		return
	}

	r := mux.NewRouter()

	r.HandleFunc("/slides", getSlides).Methods("GET")
	r.HandleFunc("/slides", createSlide).Methods("POST")
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./htdocs"))))

	http.ListenAndServe(":8080", r)

}

func getSlides(w http.ResponseWriter, r *http.Request) {
	slides := []slide{}
	encoder := json.NewEncoder(w)

	q := `SELECT slide_id, slide_info FROM slide`

	err := db.Select(&slides, q)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	encoder.Encode(slides)
}

func createSlide(w http.ResponseWriter, r *http.Request) {
	newSlide := slide{}
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&newSlide)

	q := `INSERT INTO slide (slide_info)
			VALUES ($1)`

	_, err := db.Exec(q, newSlide.SlideInfo)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusCreated)

}
