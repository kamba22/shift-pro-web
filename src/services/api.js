import axios from 'axios';

// This is the URL of your Spring Boot Backend
const API_URL = "http://localhost:8080/api/logs";

const api = {
    login: (email, password) => {
        return axios.post(`${API_URL}/login?email=${email}&password=${password}`);
    },
    clockIn: (id) => {
        return axios.post(`${API_URL}/in/${id}`);
    },
    clockOut: (id, summary) => {
        // We send the summary as plain text in the body
        return axios.post(`${API_URL}/out/${id}`, summary, {
            headers: { 'Content-Type': 'text/plain' }
        });
    },

    getAllLogsForAdmin: () => {
        return axios.get(`${API_URL}/admin/all`);
    }
};

export default api;