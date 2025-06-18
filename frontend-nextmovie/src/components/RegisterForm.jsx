import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../utils/validation";
import Swal from "sweetalert2";
import "./AuthForm.css";

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

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
	const storeError = useAuthStore((state) => state.error);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// No usamos localError ni success porque usaremos Swal
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const error = validateRegisterForm(form);
		if (error) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: error,
				confirmButtonText: "Aceptar",
			});
			return;
		}

		try {
			await register({
				name: form.fullName,
				email: form.email,
				password: form.password,
				password_confirmation: form.repeatPassword,
			});
			await Swal.fire({
				icon: "success",
				title: "Cuenta creada",
				text: "Tu cuenta ha sido creada exitosamente.",
				confirmButtonText: "Aceptar",
			});
			navigate("/");
		} catch (err) {
			const msg =
				err.response?.data?.error ||
				err.response?.data?.message ||
				"Error al crear la cuenta. Por favor, inténtalo de nuevo.";
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: msg,
				confirmButtonText: "Aceptar",
			});
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

				{/* Eliminados mensajes inline de error y success */}

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
