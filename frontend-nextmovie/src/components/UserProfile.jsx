import React, { useEffect, useRef, useState } from "react";
import "./UserProfile.css";
import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";
import { api } from "../utils/axiosConfig";

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
	const [triedWiki, setTriedWiki] = React.useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (src) return;
			if (!tmdbId) {
				if (!cancelled) setSrc(fallback);
				return;
			}
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
				if (!cancelled)
					setSrc(
						data.poster_path
							? `${TMDB_IMAGE_BASE}/w500${data.poster_path}`
							: fallback
					);
			} catch {
				if (!cancelled) setSrc(fallback);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [poster_path, tmdbId, type, src]);

	const handleError = async () => {
		if (!triedWiki) {
			setTriedWiki(true);
			try {
				const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
					title || ""
				)}`;
				const res = await fetch(url);
				if (res.ok) {
					const data = await res.json();
					if (data.thumbnail?.source) {
						setSrc(data.thumbnail.source);
						return;
					}
				}
			} catch {}
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
	const {
		user,
		loading: authLoading,
		checkUser,
	} = useAuthStore((s) => ({
		user: s.user,
		loading: s.loading,
		checkUser: s.checkUser,
	}));

	const [data, setData] = useState(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		current_password: "",
		new_password: "",
	});
	const [saving, setSaving] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	// Ejecuta checkUser SOLO una vez
	const didInit = useRef(false);
	useEffect(() => {
		if (didInit.current) return;
		didInit.current = true;
		checkUser().catch(() => {});
	}, [checkUser]);

	// Carga perfil SOLO una vez por user.id
	const fetchedForUserId = useRef(null);
	useEffect(() => {
		if (!user?.id) return;
		if (fetchedForUserId.current === user.id) return;
		fetchedForUserId.current = user.id;

		let cancelled = false;
		(async () => {
			try {
				const { data: json } = await api.get(
					`/users/${user.id}/profile-data`,
					{
						headers: { Accept: "application/json" },
					}
				);
				if (cancelled) return;
				setData(json);
				setForm((p) => ({
					...p,
					name: json?.user?.name ?? user.name ?? "",
					email: json?.user?.email ?? user.email ?? "",
				}));
				setErrMsg("");
			} catch (err) {
				if (cancelled) return;
				const msg =
					err?.response?.data?.error ||
					err?.response?.data?.message ||
					err?.message ||
					"Error loading profile";
				setErrMsg(msg);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [user]);

	const handleChange = (e) =>
		setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

	const validatePassword = (password) => {
		if (!password) return [];
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
		const pwErrors = validatePassword(form.new_password);
		if (pwErrors.length) {
			await Swal.fire({
				icon: "error",
				title: "Invalid password",
				html:
					"Your new password must contain:<br><ul style='text-align:left'>" +
					pwErrors.map((e) => `<li>${e}</li>`).join("") +
					"</ul>",
				confirmButtonText: "OK",
			});
			return;
		}

		setSaving(true);
		try {
			await api.put(`/users/${user.id}`, form, {
				headers: { Accept: "application/json" },
			});
			await Swal.fire({
				icon: "success",
				title: "Profile updated",
				confirmButtonText: "OK",
			});
		} catch (err) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text:
					err?.response?.data?.message ||
					err?.response?.data?.error ||
					err?.message ||
					"Failed to update.",
			});
		} finally {
			setSaving(false);
		}
	};

	const confirmAndSubmit = () =>
		Swal.fire({
			title: "Are you sure?",
			text: "Do you want to apply changes to your profile?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, apply",
		}).then((r) => r.isConfirmed && handleSubmit());

	// Estados
	if (authLoading && !user) return <p>Loading user...</p>;
	if (!user) return <p>No active session.</p>;
	if (errMsg && !data) return <p style={{ color: "tomato" }}>{errMsg}</p>;
	if (!data) return <p>Loading profile...</p>;

	const { stats = {}, lists = [], user: userData = {} } = data;
	const total_movies = stats.total_movies ?? 0;
	const total_series = stats.total_series ?? 0;
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
				alt="trophy"
			/>
		));

	const getList = (keyword) =>
		lists.find((l) => l?.name?.toLowerCase().includes(keyword))?.items ||
		[];

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
						<h2>{userData.name || user.name}</h2>
						<div className="stats">
							<span>{total_movies} Movies added to lists</span>
							<span>{total_series} Series added to lists</span>
						</div>
					</div>
					<div className="trophies">{trophies}</div>
				</div>
			</div>

			{/* … tus listas tal cual … */}

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
