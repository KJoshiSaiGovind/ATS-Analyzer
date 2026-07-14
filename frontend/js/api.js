const API_BASE_URL = 'http://127.0.0.1:8080/api';

const api = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token) => localStorage.setItem('token', token),
    logout: () => localStorage.removeItem('token'),
    
    headers: function(isUpload = false) {
        const headers = {};
        if (!isUpload) {
            headers['Content-Type'] = 'application/json';
        }
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    async request(endpoint, method = 'GET', body = null, isUpload = false) {
        const options = {
            method,
            headers: this.headers(isUpload)
        };
        if (body) {
            options.body = isUpload ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'API Request Failed');
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
