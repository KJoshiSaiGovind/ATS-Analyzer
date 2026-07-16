const API_BASE_URL = 'https://ats-analyzer-9jym.onrender.com/api';

export const api = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token: string) => localStorage.setItem('token', token),
    logout: () => localStorage.removeItem('token'),
    
    headers: function(isUpload = false) {
        const headers: Record<string, string> = {};
        if (!isUpload) {
            headers['Content-Type'] = 'application/json';
        }
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    async request(endpoint: string, method = 'GET', body: any = null, isUpload = false) {
        const options: RequestInit = {
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
                let errorMessage = 'API Request Failed';
                if (data.detail) {
                    if (Array.isArray(data.detail)) {
                        errorMessage = data.detail.map((err: any) => err.msg).join(', ');
                    } else {
                        errorMessage = data.detail;
                    }
                }
                throw new Error(errorMessage);
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
