import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

function isPasswordSecure(password) {
	const minLength = 8;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
	return (
		password.length >= minLength &&
		hasUpper &&
		hasLower &&
		hasNumber &&
		hasSymbol
	);
}

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterForm() {
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		password: "",
		repeatPassword: "",
		terms: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setShowRepeatPassword] = useState(false);

	const register = useAuthStore((state) => state.register);
	const loading = useAuthStore((state) => state.loading);
	const storeError = useAuthStore((state) => state.storeError);

	const [localError, setLocalError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		setLocalError("");
		setSuccess("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validaciones locales
		if (!form.fullName.trim()) {
			setLocalError("Please enter your full name.");
			return;
		}
		if (!form.email.trim()) {
			setLocalError("Please enter your email.");
			return;
		}
		if (!isValidEmail(form.email)) {
			setLocalError("Invalid email format.");
			return;
		}
		if (!form.password) {
			setLocalError("Please enter a password.");
			return;
		}
		if (!isPasswordSecure(form.password)) {
			setLocalError(
				"Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
			);
			return;
		}
		if (form.password !== form.repeatPassword) {
			setLocalError("Passwords do not match.");
			return;
		}
		if (!form.terms) {
			setLocalError("You must accept the Terms and Conditions.");
			return;
		}

		try {
			await register({
				name: form.fullName,
				email: form.email,
				password: form.password,
				password_confirmation: form.repeatPassword,
			});
			setSuccess("Account created successfully!");
			navigate("/");
		} catch (err) {
			// El error ya se guarda en storeError en el store
			setSuccess("");
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
							name="fullName"
							placeholder="Full name"
							value={form.fullName}
							onChange={handleChange}
							autoComplete="off"
						/>
					</div>
					<div className="input-wrapper">
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={form.email}
							onChange={handleChange}
							autoComplete="off"
						/>
					</div>
					<div className="input-wrapper">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							autoComplete="new-password"
						/>
						<button
							type="button"
							className="toggle-password-btn"
							onClick={() => setShowPassword((v) => !v)}
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
					<div className="input-wrapper">
						<input
							type={showRepeatPassword ? "text" : "password"}
							name="repeatPassword"
							placeholder="Repeat password"
							value={form.repeatPassword}
							onChange={handleChange}
							autoComplete="new-password"
						/>
						<button
							type="button"
							className="toggle-password-btn"
							onClick={() => setShowRepeatPassword((v) => !v)}
							aria-label={
								showRepeatPassword
									? "Hide password"
									: "Show password"
							}
						>
							<img
								src={showRepeatPassword ? hideIcon : showIcon}
								alt="Toggle password"
							/>
						</button>
					</div>
				</div>
				<div className="terms">
					<input
						type="checkbox"
						name="terms"
						id="terms"
						checked={form.terms}
						onChange={handleChange}
					/>
					<label htmlFor="terms">
						I accept the <a href="#">Terms and Conditions</a> and
						the <a href="#">Privacy Policy</a>
					</label>
				</div>
				{(localError || storeError) && (
					<div className="error">{localError || storeError}</div>
				)}
				{success && <div className="success">{success}</div>}
				<button
					type="submit"
					className="create-account"
					disabled={loading}
				>
					{loading ? "Creating Account..." : "Create Account"}
				</button>
				<div className="signin-section">
					<hr className="divider" />
					<div className="signin-link">
						Already have an account?{" "}
						<a href="/user-login">Sign in →</a>
					</div>
				</div>
			</form>
		</div>
	);
}
