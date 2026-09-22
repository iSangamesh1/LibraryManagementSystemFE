// import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:8080/borrow-records";

export const getAllBorrowRecords = () => {
    return api.get(API_URL);
};

export const getAllBorrowRecordById = (id) => {
    return api.get(API_URL, id)
}

export const addBorrowRecord = borrowRecord => api.post(API_URL, borrowRecord);

export const updateBorrowRecord = (id, borrowRecord) => {
    return api.put(`${API_URL}/${id}`, borrowRecord);
};

export const deleteBorrowRecord = id => api.delete(`${API_URL}/${id}`);

export const returnBorrowRecord = (id) => api.put(`${API_URL}/${id}/return`);
