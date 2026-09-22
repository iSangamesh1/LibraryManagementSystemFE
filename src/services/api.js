import axios from "axios";

// We could manually add the token in every getAllBooks(), addBook(), updateBook(), etc., but that would repeat the same code everywhere.
// Axios interceptor
// React app -> axios request -> interceptor -> get token from local storage -> authorization (Bearer JWT) -> apring security JWT authentication Filter -> controller
const api = axios.create({
    baseURL : "http://localhost:8080"
});
//  Creating our own Axios instance called api

api.interceptors.request.use( // the interceptor automatically changes the request to effectively become: GET /books
                                // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
    (config) => { // "config" contains the configuration/details of the Axios request, such as URL, method, headers, etc. if token = null, BE will reject as invalid and not procceed
        const token = localStorage.getItem("token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}` // Add the JWT to the Authorization header.Spring Security expects the format: Example: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
        }

        // Return the modified request configuration. Axios uses this config to actually send the request.
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

export default api;