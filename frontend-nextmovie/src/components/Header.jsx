import React, { useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "./Header.css";

export default function Header() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (!search.trim()) return;
		navigate({
			pathname: "/search-results",
			search: `?${createSearchParams({ query: search })}`,
		});
		setSearch("");
	};

	return (
		<header className="nm-header">
			<div className="nm-header__container">
				<Link to="/" className="nm-header__logo-link">
					<img
						className="nm-header__logo"
						src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1747902121/upscalemedia-transformed_dtuirk.png"
						alt="NextMovie logo"
					/>
				</Link>
				<form className="nm-header__search" onSubmit={handleSearch}>
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
						placeholder="Search for Movies or Series"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</form>
				{!user ? (
					<button
						className="nm-header__button"
						onClick={() => navigate("/user-login")}
					>
						Login
					</button>
				) : (
					<div className="nm-header__user-area">
						<span className="nm-header__username">
							{user.name || user.username}
						</span>
						<button
							className="nm-header__menu-button"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label="Abrir menú"
						>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
						</button>
						<div
							className={`nm-header__dropdown ${
								menuOpen ? "nm-header__dropdown--open" : ""
							}`}
						>
							<Link
								to="/user-profile"
								className="nm-header__dropdown-link"
								onClick={() => setMenuOpen(false)}
							>
								My profile
							</Link>
							<button
								className="nm-header__dropdown-link"
								onClick={() => {
									setMenuOpen(false);
									logout();
								}}
							>
								Log out / Login
							</button>
						</div>
					</div>
				)}
			</div>
			{user && <div className="nm-header__white-bar" />}
		</header>
	);
}
