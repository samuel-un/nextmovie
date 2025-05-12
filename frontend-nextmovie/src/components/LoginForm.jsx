import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css"; // Reutiliza el mismo CSS que el registro

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

export default function LoginForm() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
		setSuccess("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		if (!form.email || !form.password) {
			setError("Please fill in all fields.");
			return;
		}

		try {
			const response = await fetch("http://localhost:8000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: form.email,
					password: form.password,
				}),
			});

			if (!response.ok) {
				let data = {};
				try {
					data = await response.json();
				} catch {}
				setError(
					data.message ||
						"Login failed. Please check your credentials and try again."
				);
				return;
			}

			setSuccess("Login successful!");
			// Redirige a la ruta principal tras el login
			setTimeout(() => {
				navigate("/home"); // Cambia "/" por la ruta que quieras tras login
			}, 900);
			setForm({
				email: "",
				password: "",
			});
		} catch (err) {
			setError("Could not connect to the server.");
		}
	};

	return (
		<div className="register-bg">
			<form
				className="register-form"
				onSubmit={handleSubmit}
				autoComplete="off"
			>
				<img
					src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036873/NextMovie_logo_letras_y_icono_axjmma.png"
					alt="NextMovie Logo"
					className="logo"
				/>
				<div className="inputs-section">
					<div className="input-wrapper">
						<input
							type="text"
							name="email"
							placeholder="Email"
							value={form.email}
							onChange={handleChange}
							autoComplete="username"
						/>
					</div>
					<div className="input-wrapper">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							autoComplete="current-password"
						/>
						<button
							type="button"
							className="toggle-password-btn"
							onClick={() => setShowPassword((v) => !v)}
							tabIndex={0}
							aria-label={
								showPassword ? "Hide password" : "Show password"
							}
						>
							<img
								src={showPassword ? hideIcon : showIcon}
								alt={
									showPassword
										? "Hide password"
										: "Show password"
								}
							/>
						</button>
					</div>
				</div>
				{error && <div className="error">{error}</div>}
				{success && <div className="success">{success}</div>}
				<button
					type="submit"
					className="create-account"
					style={{ marginBottom: "1.3rem" }}
				>
					Login
				</button>
				<hr className="divider" />
				<div className="signin-link">
					Don't have an account?{" "}
					<br/><a href="#" style={{ color: "#b86cff" }}>
						Create an account
					</a>
				</div>
			</form>
		</div>
	);
}
