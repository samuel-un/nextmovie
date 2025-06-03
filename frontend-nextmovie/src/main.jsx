import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { useAuthStore } from "./store/useAuthStore";

const InitAuth = ({ children }) => {
	const checkUser = useAuthStore((state) => state.checkUser);

	useEffect(() => {
		checkUser();
	}, [checkUser]);

	return children;
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<InitAuth>
				<App />
			</InitAuth>
		</BrowserRouter>
	</StrictMode>
);
