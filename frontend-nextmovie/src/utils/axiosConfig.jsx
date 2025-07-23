import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nextmovie-production-1089.up.railway.app/api/auth/register',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
