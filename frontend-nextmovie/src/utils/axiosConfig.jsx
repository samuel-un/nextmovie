import axios from "axios";

// Usamos la variable de entorno, o fallback a localhost
const root = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
	/\/+$/,
	""
);

const api = axios.create({
	baseURL: `${root}/api`,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
