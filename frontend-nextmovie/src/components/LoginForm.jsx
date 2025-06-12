import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "./RegisterForm.css";

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

export default function LoginForm() {
	const login = useAuthStore((state) => state.login);
	const loading = useAuthStore((state) => state.loading);
	const storeError = useAuthStore((state) => state.storeError);

	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [localError, setLocalError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
		setLocalError("");
		setSuccess("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLocalError("");
		setSuccess("");

		if (!form.email.trim() || !form.password) {
			setLocalError("Please fill in all fields.");
			return;
		}

		try {
			await login(form.email, form.password);
			setSuccess("Login successful!");
			setForm({ email: "", password: "" });
			setTimeout(() => {
				navigate("/");
			}, 900);
		} catch (err) {
			// storeError se actualiza en el store, mostramos localError
			setLocalError(storeError || "Login failed. Please try again.");
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
							placeholder="Username or Email"
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
								alt="Toggle password"
							/>
						</button>
					</div>
				</div>
				{(localError || storeError) && (
					<div className="error">{localError || storeError}</div>
				)}
				{success && <div className="success">{success}</div>}
				<button
					type="submit"
					className="create-account"
					style={{ marginBottom: "1.3rem" }}
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				<hr className="divider" />
				<div className="signin-link">
					Don't have an account?
					<a
						href="/user-register"
						style={{ color: "#b86cff", marginLeft: 4 }}
					>
						<br />
						Create an account →
					</a>
				</div>
			</form>
		</div>
	);
}
