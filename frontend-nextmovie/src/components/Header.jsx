import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";
import "./Header.css";

export default function Header() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const firstMenuItemRef = useRef(null);

	const handleSearch = (e) => {
		e.preventDefault();
		if (!search.trim()) return;
		navigate({
			pathname: "/search-results",
			search: `?${createSearchParams({ query: search })}`,
		});
		setSearch("");
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!e.target.closest(".nm-header__user-area")) {
				setMenuOpen(false);
			}
		};
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				setMenuOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleEsc);

		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, []);

	useEffect(() => {
		if (menuOpen && firstMenuItemRef.current) {
			firstMenuItemRef.current.focus();
		}
	}, [menuOpen]);

	const confirmLogout = () => {
		Swal.fire({
			title: "Do you want to log out?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, log out",
			cancelButtonText: "Cancel",
			customClass: {
				popup: "swal2-popup",
				title: "swal2-title",
				content: "swal2-content",
				confirmButton: "swal2-confirm",
				cancelButton: "swal2-cancel",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				logout();
				Swal.fire({
					icon: "success",
					title: "Logged out",
					text: "You have successfully logged out.",
					confirmButtonText: "OK",
					customClass: {
						popup: "swal2-popup",
						title: "swal2-title",
						content: "swal2-content",
						confirmButton: "swal2-confirm",
					},
				});
				navigate("/");
			}
		});
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
					<span className="nm-header__search-icon" aria-hidden="true">
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
						aria-label="Search movies or series"
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
							className={`nm-header__menu-button ${
								menuOpen ? "menu-open" : ""
							}`}
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
							aria-expanded={menuOpen}
							aria-controls="user-menu"
						>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
							<span className="nm-header__bar"></span>
						</button>
						<div
							id="user-menu"
							role="menu"
							className={`nm-header__dropdown ${
								menuOpen ? "nm-header__dropdown--open" : ""
							}`}
						>
							<Link
								ref={firstMenuItemRef}
								to="/user-profile"
								className="nm-header__dropdown-link"
								role="menuitem"
								tabIndex={menuOpen ? 0 : -1}
								onClick={() => setMenuOpen(false)}
							>
								My profile
							</Link>
							<button
								className="nm-header__dropdown-link"
								role="menuitem"
								tabIndex={menuOpen ? 0 : -1}
								onClick={() => {
									setMenuOpen(false);
									confirmLogout();
								}}
							>
								Log out
							</button>
						</div>
					</div>
				)}
			</div>
			{user && <div className="nm-header__white-bar" />}
		</header>
	);
}
