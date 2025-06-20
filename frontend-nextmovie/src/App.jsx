import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import SearchResultsPage from "./components/SearchResultsPage";
import UserProfile from "./components/UserProfile";
import DetailPage from "./components/DetailPage"; // <-- Añadido
import { useAuthStore } from "./store/useAuthStore";
import Loader from "./components/Loader";

// Ruta pública: solo accesible si el usuario NO está logueado
function PublicRoute({ children }) {
	const user = useAuthStore((state) => state.user);
	const loading = useAuthStore((state) => state.loading);

	if (loading) return <Loader />;
	return user ? <Navigate to="/" replace /> : children;
}

// Ruta privada: solo accesible si el usuario ESTÁ logueado
function PrivateRoute({ children }) {
	const user = useAuthStore((state) => state.user);
	const loading = useAuthStore((state) => state.loading);

	if (loading) return <Loader />;
	return user ? children : <Navigate to="/user-login" replace />;
}

function AppContent() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const loading = useAuthStore((state) => state.loading);
	const checkUser = useAuthStore((state) => state.checkUser);

	useEffect(() => {
		checkUser();
	}, [checkUser]);

	if (loading) return <Loader />;

	return (
		<>
			<Header user={user} onLogout={logout} />
			<Routes>
				<Route
					path="/user-login"
					element={
						<PublicRoute>
							<LoginForm />
						</PublicRoute>
					}
				/>
				<Route
					path="/user-register"
					element={
						<PublicRoute>
							<RegisterForm />
						</PublicRoute>
					}
				/>
				<Route path="/" element={<Landing />} />
				<Route path="/search-results" element={<SearchResultsPage />} />
				<Route
					path="/user-profile"
					element={
						<PrivateRoute>
							<UserProfile />
						</PrivateRoute>
					}
				/>
				<Route
					path="/detail-page/:media_type/:id"
					element={<DetailPage />}
				/>
			</Routes>
			<Footer />
		</>
	);
}

export default function App() {
	return <AppContent />;
}
