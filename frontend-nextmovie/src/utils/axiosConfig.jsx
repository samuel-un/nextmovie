import axios from "axios";

const root = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
	/\/+$/,
	""
);

export const api = axios.create({
	baseURL: `${root}/api`,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	config.headers["Content-Type"] = "application/json";
	return config;
});

api.interceptors.response.use(
	(res) => res,
	(err) => {
		const ct = err?.response?.headers?.["content-type"] || "";
		if (
			typeof err?.response?.data === "string" &&
			ct.includes("text/html")
		) {
			return Promise.reject(
				new Error(
					"API_URL mal configurada: recibí HTML del frontend en vez de JSON"
				)
			);
		}
		return Promise.reject(err);
	}
);
