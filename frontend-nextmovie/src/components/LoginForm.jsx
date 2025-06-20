import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { validateLoginForm } from "../utils/validation";
import Swal from "sweetalert2";
import "./AuthForm.css";

const showIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/mostrar_aeuvx0.png";
const hideIcon =
	"https://res.cloudinary.com/dgbngcvkl/image/upload/v1747038594/ocultar_obev4s.png";

export default function LoginForm() {
	const login = useAuthStore((state) => state.login);
	const loading = useAuthStore((state) => state.loading);
	const storeError = useAuthStore((state) => state.error);

	const [form, setForm] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const error = validateLoginForm(form);
		if (error) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: error,
				confirmButtonText: "Aceptar",
				customClass: {
					popup: "swal2-popup",
					title: "swal2-title",
					content: "swal2-content",
					confirmButton: "swal2-confirm",
				},
			});
			return;
		}

		try {
			await login(form.email, form.password);
			await Swal.fire({
				icon: "success",
				title: "Login successful",
				text: "You have logged in successfully.",
				confirmButtonText: "OK",
				customClass: {
					popup: "swal2-popup",
					title: "swal2-title",
					content: "swal2-content",
					confirmButton: "swal2-confirm",
				},
			});
			setForm({ email: "", password: "" });
			navigate("/");
		} catch (err) {
			const msg =
				err.response?.data?.error ||
				err.response?.data?.message ||
				"Login failed. Please try again.";
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: msg,
				confirmButtonText: "OK",
				customClass: {
					popup: "swal2-popup",
					title: "swal2-title",
					content: "swal2-content",
					confirmButton: "swal2-confirm",
				},
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
								alt={
									showPassword
										? "Hide password"
										: "Show password"
								}
							/>
						</button>
					</div>
				</div>

				<button
					type="submit"
					className="create-account"
					style={{ marginBottom: "1.3rem" }}
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>

				<div className="signin-section">
					<hr className="divider" />
					<div className="signin-link">
						Don't have an account?
						<a
							href="/user-register"
							style={{
								color: "#9f42c6",
								fontWeight: 700,
								marginLeft: 4,
							}}
						>
							<br />
							Create an account →
						</a>
					</div>
				</div>
			</form>
		</div>
	);
}
