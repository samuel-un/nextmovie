import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000";

export const useAuthStore = create((set) => ({
	user: null,
	error: null,
	loading: true,

	setUser: (user) => set({ user }),

	checkUser: async () => {
		set({ loading: true });
		try {
			const res = await fetch(`${API_URL}/auth/me`, {
				credentials: "include",
			});

			if (res.ok) {
				const user = await res.json();
				set({ user, loading: false });
				return user;
			} else {
				set({ user: null, loading: false });
			}
		} catch (err) {
			set({ user: null, loading: false, error: err.message });
		}
	},

	register: async (formData) => {
		set({ loading: true, error: null });
		try {
			await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
				withCredentials: true,
			});

			await axios.post(`${API_URL}/auth/register`, formData, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			await axios.post(
				`${API_URL}/auth/login`,
				{
					email: formData.email,
					password: formData.password,
				},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const userResponse = await axios.get(`${API_URL}/auth/me`, {
				withCredentials: true,
			});

			set({ user: userResponse.data, loading: false });
			return userResponse.data;
		} catch (err) {
			set({
				error: err.response?.data?.message || "Error en el registro",
				loading: false,
			});
			throw err;
		}
	},

	login: async (email, password) => {
		set({ error: null, loading: true });
		try {
			await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
				withCredentials: true,
			});

			await axios.post(
				`${API_URL}/auth/login`,
				{ email, password },
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const userResponse = await axios.get(`${API_URL}/auth/me`, {
				withCredentials: true,
			});

			set({ user: userResponse.data, loading: false });
			return userResponse.data;
		} catch (err) {
			set({
				error: err.response?.data?.message || "Error en el login",
				loading: false,
			});
			throw err;
		}
	},

	logout: async () => {
		set({ loading: true });
		try {
			await axios.post(
				`${API_URL}/auth/logout`,
				{},
				{
					withCredentials: true,
				}
			);
			set({ user: null, loading: false });
		} catch (err) {
			set({
				error: err.response?.data?.message || "Error en el logout",
				loading: false,
			});
		}
	},
}));
