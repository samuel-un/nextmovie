import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import SearchResultsPage from "./components/SearchResultsPage";
import { useAuthStore } from "./store/useAuthStore";

function PublicRoute({ children }) {
	const user = useAuthStore((state) => state.user);
	return user ? <Navigate to="/" replace /> : children;
}

function AppContent() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

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
				<Route path="/" element={<Landing />} />{" "}
			</Routes>
			<Routes>
				<Route path="/search-results" element={<SearchResultsPage />} />
			</Routes>
			<Footer />
		</>
	);
}

export default function App() {
	return <AppContent />;
}
