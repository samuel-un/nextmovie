import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Instancia de axios con interceptor para JWT
export const api = axios.create({
	baseURL: API_URL,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const useAuthStore = create((set) => ({
	user: null,
	error: null,
	loading: true, // iniciamos en true porque vamos a cargar sesión

	// Nueva función para cargar usuario al arrancar
	checkUser: async () => {
		const token = localStorage.getItem("jwt_token");

		if (!token) {
			set({ user: null, loading: false });
			return;
		}

		set({ loading: true });
		try {
			const response = await api.get("/auth/me");
			set({ user: response.data, loading: false });
			return response.data;
		} catch (err) {
			localStorage.removeItem("jwt_token");
			set({
				user: null,
				loading: false,
				error: err.response?.data?.error || "Error de autenticación",
			});
		}
	},

	register: async (formData) => {
		set({ loading: true, error: null });
		try {
			const response = await api.post("/auth/register", formData);
			localStorage.setItem("jwt_token", response.data.access_token);
			set({
				user: response.data.user,
				loading: false,
			});
			return response.data.user;
		} catch (err) {
			set({
				error: err.response?.data?.error || "Error en el registro",
				loading: false,
			});
			throw err;
		}
	},

	login: async (email, password) => {
		set({ error: null, loading: true });
		try {
			const response = await api.post("/auth/login", { email, password });
			localStorage.setItem("jwt_token", response.data.access_token);
			set({
				user: response.data.user,
				loading: false,
			});
			return response.data.user;
		} catch (err) {
			set({
				error: err.response?.data?.error || "Error en el login",
				loading: false,
			});
			throw err;
		}
	},

	logout: async () => {
		set({ loading: true });
		try {
			await api.post("/auth/logout");
			localStorage.removeItem("jwt_token");
			set({ user: null, loading: false });
		} catch (err) {
			set({
				error: err.response?.data?.error || "Error en el logout",
				loading: false,
			});
		}
	},
}));
