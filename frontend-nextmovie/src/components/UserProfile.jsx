import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const TMDB_API_URL_MOVIE = "https://api.themoviedb.org/3/movie";
const TMDB_API_URL_TV = "https://api.themoviedb.org/3/tv";

function PosterWithFallback({
	title,
	poster_path,
	alt,
	tmdbId,
	type = "movie",
}) {
	const fallback =
		"https://res.cloudinary.com/dgbngcvkl/image/upload/v1749538986/image-not-found_jj2enj.jpg";

	const [src, setSrc] = React.useState(
		poster_path && poster_path !== "null" && poster_path !== ""
			? `${TMDB_IMAGE_BASE}/w500${
					poster_path.startsWith("/")
						? poster_path
						: `/${poster_path}`
			  }`
			: null
	);
	const [loading, setLoading] = React.useState(false);
	const [triedWiki, setTriedWiki] = React.useState(false);

	React.useEffect(() => {
		async function fetchPosterFromTMDb() {
			if (src) return;
			if (!tmdbId) {
				setSrc(fallback);
				return;
			}
			setLoading(true);
			console.log(
				`Fetching TMDb poster for "${title}" (type=${type}) with tmdbId: ${tmdbId}`
			);
			try {
				const baseUrl =
					type === "tv" ? TMDB_API_URL_TV : TMDB_API_URL_MOVIE;
				const res = await fetch(`${baseUrl}/${tmdbId}`, {
					headers: {
						Authorization: `Bearer ${
							import.meta.env.VITE_TMDB_TOKEN
						}`,
						Accept: "application/json",
					},
				});
				if (!res.ok) throw new Error("TMDb fetch failed");
				const data = await res.json();
				if (data.poster_path) {
					setSrc(`${TMDB_IMAGE_BASE}/w500${data.poster_path}`);
				} else {
					setSrc(fallback);
				}
			} catch (e) {
				console.error("Error fetching poster from TMDb:", e);
				setSrc(fallback);
			} finally {
				setLoading(false);
			}
		}
		fetchPosterFromTMDb();
	}, [poster_path, tmdbId, type]);

	const handleError = async () => {
		if (!triedWiki) {
			setTriedWiki(true);
			try {
				const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
					title
				)}`;
				const res = await fetch(url);
				if (!res.ok) throw new Error("No wiki");
				const data = await res.json();
				if (data.thumbnail && data.thumbnail.source) {
					setSrc(data.thumbnail.source);
					return;
				}
			} catch (e) {}
		}
		setSrc(fallback);
	};

	return (
		<img
			src={src || fallback}
			alt={alt || title || "Untitled"}
			className="poster"
			loading="lazy"
			onError={handleError}
			style={{ objectFit: "cover" }}
		/>
	);
}

export default function UserProfile() {
	const [data, setData] = useState(null);
	const user = useAuthStore((state) => state.user);

	const [form, setForm] = useState({
		name: "",
		email: "",
		current_password: "",
		new_password: "",
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.id) return;
			try {
				const resp = await fetch(`/api/users/${user.id}/profile-data`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"jwt_token"
						)}`,
						Accept: "application/json",
					},
				});
				const ct = resp.headers.get("content-type") || "";
				if (!resp.ok || !ct.includes("application/json")) {
					const text = await resp.text();
					console.error("Unexpected backend response:", text);
					return;
				}
				const json = await resp.json();
				setData(json);

				setForm((prev) => ({
					...prev,
					name: json.user.name,
					email: user.email,
				}));
			} catch (err) {
				console.error("Error fetching profile:", err);
			}
		};
		fetchProfile();
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const validatePassword = (password) => {
		const errors = [];
		if (password.length < 8) errors.push("at least 8 characters");
		if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
		if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
		if (!/[0-9]/.test(password)) errors.push("one number");
		if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
			errors.push("one special character");
		return errors;
	};

	const handleSubmit = async () => {
		setSaving(true);

		if (form.new_password.trim() !== "") {
			const passwordErrors = validatePassword(form.new_password);
			if (passwordErrors.length > 0) {
				await Swal.fire({
					icon: "error",
					title: "Invalid password",
					html:
						"Your new password must contain:<br><ul style='text-align:left'>" +
						passwordErrors.map((e) => `<li>${e}</li>`).join("") +
						"</ul>",
					confirmButtonText: "OK",
					customClass: {
						popup: "swal2-popup",
						title: "swal2-title",
						content: "swal2-content",
						confirmButton: "swal2-confirm",
					},
				});
				setSaving(false);
				return;
			}
		}

		try {
			const resp = await fetch(`/api/users/${user.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${localStorage.getItem(
						"jwt_token"
					)}`,
				},
				body: JSON.stringify(form),
			});
			const result = await resp.json();

			if (!resp.ok) {
				await Swal.fire({
					icon: "error",
					title: "Error",
					text: result?.message || "Failed to update.",
					confirmButtonText: "OK",
					customClass: {
						popup: "swal2-popup",
						title: "swal2-title",
						content: "swal2-content",
						confirmButton: "swal2-confirm",
					},
				});
				setSaving(false);
				return;
			}

			await Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Profile updated successfully.",
				confirmButtonText: "OK",
				customClass: {
					popup: "swal2-popup",
					title: "swal2-title",
					content: "swal2-content",
					confirmButton: "swal2-confirm",
				},
			});
		} catch (error) {
			console.error(error);
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: "Network error.",
				confirmButtonText: "OK",
				customClass: {
					popup: "swal2-popup",
					title: "swal2-title",
					content: "swal2-content",
					confirmButton: "swal2-confirm",
				},
			});
		} finally {
			setSaving(false);
		}
	};

	const confirmAndSubmit = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you want to apply changes to your profile?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, apply changes",
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
				handleSubmit();
			}
		});
	};

	if (!user) return <p>Loading user...</p>;
	if (!data) return <p>Loading profile...</p>;

	const { stats, lists } = data;
	const { total_movies, total_series } = stats;
	const totalItems = total_movies + total_series;

	const trophies = [
		{ cond: totalItems >= 1, file: "1-movie_or_series_btmh1u.png" },
		{ cond: totalItems >= 10, file: "10-movie_or_series_l9vgy6.png" },
		{
			cond: totalItems >= 50,
			file: "50-total-movie_and_series_lojrak.png",
		},
		{
			cond: totalItems >= 100,
			file: "100-total-movie_and_series_p8i4rq.png",
		},
		{ cond: total_series >= 50, file: "50_series_py9gme.png" },
	]
		.filter((t) => t.cond)
		.map((t, i) => (
			<img
				key={i}
				className="trophy"
				src={`https://res.cloudinary.com/dgbngcvkl/image/upload/v1750229220/${t.file}`}
				alt="trofeo"
			/>
		));

	const getList = (keyword) =>
		lists.find((l) => l.name.toLowerCase().includes(keyword))?.items || [];

	return (
		<div className="user-profile">
			<div className="profile-header">
				<div className="inner-container">
					<div className="avatar">
						<img
							src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750237914/image-profile_ipcyhv.png"
							alt="User avatar"
						/>
					</div>
					<div className="user-details">
						<h2>{user.name}</h2>
						<div className="stats">
							<span>{total_movies} Movies added to lists</span>
							<span>{total_series} Series added to lists</span>
						</div>
					</div>
					<div className="trophies">{trophies}</div>
				</div>
			</div>

			<div className="inner-container">
				<div className="lists-row">
					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240679/viewed_jwguww.png"
								alt="Viewed"
								className="list-icon"
							/>
							<h3>Watched movies</h3>
						</div>
						<div className="media-grid">
							{getList("watched movies").map(
								(item) => (
									console.log(item),
									(
										<a
											key={item.movie_id || item.id}
											href={`/detail-page/${"movie"}/${
												item.tmdbId
											}`}
											className="poster-link"
											tabIndex={0}
											aria-label={`View details of ${
												item.title || item.name
											}`}
											data-title={item.title || item.name}
										>
											<PosterWithFallback
												title={item.title || item.name}
												poster_path={item.poster}
												tmdbId={
													item.tmdbId ||
													item.movie_id ||
													item.id
												}
												alt={item.title || "Untitled"}
											/>
										</a>
									)
								)
							)}
						</div>
					</div>

					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240679/viewed_jwguww.png"
								alt="Viewed"
								className="list-icon"
							/>
							<h3>Watched series</h3>
						</div>
						<div className="media-grid">
							{getList("watched series").map((item) => (
								<a
									key={item.id}
									href={`/detail-page/${"tv"}/${item.tmdbId}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`View details of ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster_path={item.poster}
										tmdbId={item.tmdbId || item.id}
										alt={item.title || "Untitled"}
										type="tv"
									/>
								</a>
							))}
						</div>
					</div>
				</div>

				<div className="lists-row">
					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240554/to-see_kdabyr.png"
								alt="To watch"
								className="list-icon"
							/>
							<h3>Movies to watch</h3>
						</div>
						<div className="media-grid">
							{getList("movies to watch").map((item) => (
								<a
									key={item.movie_id || item.id}
									href={`/detail-page/${"movie"}/${
										item.tmdbId
									}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`View details of ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster_path={item.poster}
										tmdbId={
											item.tmdbId ||
											item.movie_id ||
											item.id
										}
										alt={item.title || "Untitled"}
									/>
								</a>
							))}
						</div>
					</div>

					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240554/to-see_kdabyr.png"
								alt="To watch"
								className="list-icon"
							/>
							<h3>Series to watch</h3>
						</div>
						<div className="media-grid">
							{getList("series to watch").map((item) => (
								<a
									key={item.id}
									href={`/detail-page/${"tv"}/${item.tmdbId}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`View details of ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster_path={item.poster}
										tmdbId={item.tmdbId || item.id}
										alt={item.title || "Untitled"}
										type="tv"
									/>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="profile-settings">
				<div className="inner-container">
					<h3>PROFILE SETTINGS</h3>
					<div className="settings-form">
						<div className="left">
							<label>Name:</label>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Full name..."
							/>

							<label>Email:</label>
							<input
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Email..."
							/>
						</div>

						<div className="right">
							<label>Current password:</label>
							<input
								type="password"
								name="current_password"
								value={form.current_password}
								onChange={handleChange}
								placeholder="Current password..."
							/>

							<label>New password:</label>
							<input
								type="password"
								name="new_password"
								value={form.new_password}
								onChange={handleChange}
								placeholder="New password..."
							/>
						</div>
					</div>

					<button
						className="apply-btn"
						onClick={confirmAndSubmit}
						disabled={saving}
					>
						{saving ? "Saving..." : "APPLY CHANGES"}
					</button>
				</div>
			</div>
		</div>
	);
}
