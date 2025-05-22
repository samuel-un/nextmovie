import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

const API_URL = "http://localhost:8000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchUser = useCallback(async (jwtToken) => {
		try {
			const res = await fetch(`${API_URL}/me`, {
				headers: { Authorization: `Bearer ${jwtToken}` },
			});
			if (!res.ok) throw new Error("Token inválido o expirado");
			const data = await res.json();
			setUser(data.user);
			setError(null);
			setToken(jwtToken);
			localStorage.setItem("jwt_token", jwtToken);
		} catch (err) {
			setUser(null);
			setToken(null);
			localStorage.removeItem("jwt_token");
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const login = async (email, password) => {
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Error en login");
			}
			const data = await res.json();
			await fetchUser(data.token);
			setError(null);
			return true;
		} catch (err) {
			setError(err.message);
			setLoading(false);
			return false;
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("jwt_token");
	};

	useEffect(() => {
		const storedToken = localStorage.getItem("jwt_token");
		if (storedToken) {
			fetchUser(storedToken);
		} else {
			setLoading(false);
		}
	}, [fetchUser]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				error,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
	return context;
}
