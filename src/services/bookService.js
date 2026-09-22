// import axios from "axios";
import api from "./api";

// we changed from axios to api, as all the request now will require JWT, hence it is handled in api
const API_URL = "http://localhost:8080/books";

export const getAllBooks = () => {
    // return axios.get(API_URL);
    return api.get(API_URL);
}

export const addBook = (book) => {
    return api.post(API_URL, book) // POST /books, book is the object we need to send
}

export const updateBook = (id, book) => {
    return api.put(`${API_URL}/${id}`, book) // if id=3, `${API_URL}/${id}` becomes http://localhost:8080/books/3
}

export const deleteBook = (id) => {
    return api.delete(`${API_URL}/${id}`)
}