import React, { useState } from "react";
import "./RegisterForm.css";

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

// Función para validar contraseña segura
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

// Validación básica de email
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
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Limpiar mensajes al cambiar campos
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		setError("");
		setSuccess("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (
			!form.fullName ||
			!form.email ||
			!form.password ||
			!form.repeatPassword
		) {
			setError("Por favor completa todos los campos.");
			return;
		}

		if (!isValidEmail(form.email)) {
			setError("Introduce un email válido.");
			return;
		}

		if (!isPasswordSecure(form.password)) {
			setError(
				"La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
			);
			return;
		}

		if (form.password !== form.repeatPassword) {
			setError("Las contraseñas no coinciden.");
			return;
		}
		if (!form.terms) {
			setError(
				"Debes aceptar los Términos y Condiciones y la Política de Privacidad."
			);
			return;
		}

		// ENVÍA LOS DATOS AL BACKEND
		try {
			const response = await fetch("http://localhost:8000/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.fullName,
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
						"Hubo un error al crear el usuario. Revisa los datos e inténtalo de nuevo."
				);
				return;
			}

			setSuccess("¡Cuenta creada con éxito!");
			setForm({
				fullName: "",
				email: "",
				password: "",
				repeatPassword: "",
				terms: false,
			});
		} catch (err) {
			setError("No se pudo conectar con el servidor.");
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
							tabIndex={0}
							aria-label={
								showPassword
									? "Ocultar contraseña"
									: "Mostrar contraseña"
							}
						>
							<img
								src={showPassword ? hideIcon : showIcon}
								alt={
									showPassword
										? "Ocultar contraseña"
										: "Mostrar contraseña"
								}
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
							tabIndex={0}
							aria-label={
								showRepeatPassword
									? "Ocultar contraseña"
									: "Mostrar contraseña"
							}
						>
							<img
								src={showRepeatPassword ? hideIcon : showIcon}
								alt={
									showRepeatPassword
										? "Ocultar contraseña"
										: "Mostrar contraseña"
								}
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
				{error && <div className="error">{error}</div>}
				{success && <div className="success">{success}</div>}
				<button type="submit" className="create-account">
					Create Account
				</button>
				<div className="signin-section">
					<hr className="divider" />
					<div className="signin-link">
						Already have an account? <br />
						<a href="/login">Sign in →</a>
					</div>
				</div>
			</form>
		</div>
	);
}
