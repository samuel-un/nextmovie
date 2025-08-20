import axios from "axios";

// Root sin barras finales; por defecto localhost en dev
const root = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
	/\/+$/,
	""
);

export const api = axios.create({
	baseURL: `${root}/api`,
	timeout: 20000,
	headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Adjunta JWT si existe
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Ayuda a detectar cuando estás pegando al front de Vercel por error
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
					"VITE_API_URL mal configurada: recibí HTML (frontend) en vez de JSON (backend)."
				)
			);
		}
		// Si el token vence, límpialo
		if (err?.response?.status === 401) {
			localStorage.removeItem("jwt_token");
		}
		return Promise.reject(err);
	}
);
