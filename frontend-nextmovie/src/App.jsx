import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Header from "./components/Header";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Header />} />
			<Route path="/login" element={<LoginForm />} />
			<Route path="/register" element={<RegisterForm />} />
		</Routes>
	);
}

export default App;
