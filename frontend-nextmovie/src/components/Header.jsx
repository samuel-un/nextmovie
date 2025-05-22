import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ user, onLogout }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<header className="nm-header">
			<div className="nm-header__container">
				<Link to="/" className="nm-header__logo-link">
					<img
						className="nm-header__logo"
						src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1747901188/NextMovie_logo_letras_gxdbmh.png"
						alt="NextMovie logo"
					/>
				</Link>
				<div className="nm-header__search">
					<span className="nm-header__search-icon">
						<svg
							width="22"
							height="22"
							fill="none"
							stroke="#b0b0b0"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</span>
					<input
						className="nm-header__search-input"
						type="text"
						placeholder="Búsqueda de Películas o Series"
					/>
				</div>
				{!user ? (
					<button
						className="nm-header__button"
						onClick={() => navigate("/login")}
					>
						Iniciar Sesión
					</button>
				) : (
					<div className="nm-header__user-area">
						<span className="nm-header__username">
							{user.username}
						</span>
						<button
							className="nm-header__menu-button"
							onClick={() => setMenuOpen((open) => !open)}
							aria-label="Abrir menú"
						>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
						</button>
						{menuOpen && (
							<div className="nm-header__dropdown">
								<Link
									to="/user-profile"
									className="nm-header__dropdown-link"
									onClick={() => setMenuOpen(false)}
								>
									My profile
								</Link>
								<button
									className="nm-header__dropdown-link"
									onClick={onLogout}
								>
									Log out / Login
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
