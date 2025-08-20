import { create } from "zustand";
import axios from "axios";


const ROOT = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
	/\/+$/,
	""
);

export const api = axios.create({
	baseURL: `${ROOT}/api`,

});


api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	config.headers["Content-Type"] = "application/json";
	return config;
});

const pickErr = (err, fallback) =>
	err?.response?.data?.error ||
	err?.response?.data?.message ||
	err?.message ||
	fallback;

export const useAuthStore = create((set) => ({
	user: null,
	error: null,
	loading: true,


	checkUser: async () => {
		const token = localStorage.getItem("jwt_token");
		if (!token) {
			set({ user: null, loading: false });
			return;
		}

		set({ loading: true });
		try {
			const { data } = await api.get("/auth/me");
			set({ user: data, loading: false });
			return data;
		} catch (err) {
			localStorage.removeItem("jwt_token");
			set({
				user: null,
				loading: false,
				error: pickErr(err, "Error de autenticación"),
			});
		}
	},

	register: async (formData) => {
		set({ loading: true, error: null });
		try {
			const { data } = await api.post("/auth/register", formData);
			if (data?.access_token)
				localStorage.setItem("jwt_token", data.access_token);
			set({
				user: data?.user ?? null,
				loading: false,
			});
			return data?.user ?? null;
		} catch (err) {
			set({
				error: pickErr(err, "Error en el registro"),
				loading: false,
			});
			throw err;
		}
	},

	login: async (email, password) => {
		set({ error: null, loading: true });
		try {
			const { data } = await api.post("/auth/login", { email, password });
			if (data?.access_token)
				localStorage.setItem("jwt_token", data.access_token);
			set({
				user: data?.user ?? null,
				loading: false,
			});
			return data?.user ?? null;
		} catch (err) {
			set({
				error: pickErr(err, "Error en el login"),
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
				error: pickErr(err, "Error en el logout"),
				loading: false,
			});
		}
	},
}));
