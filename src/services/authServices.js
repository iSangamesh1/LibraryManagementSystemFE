import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const login = (username, password) => {
    return axios.post(`${API_URL}/login`, {
        username,
        password
    });
};