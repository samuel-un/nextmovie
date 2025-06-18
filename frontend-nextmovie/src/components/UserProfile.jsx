import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useAuthStore } from "../store/useAuthStore";
import Swal from "sweetalert2";

function PosterWithFallback({ title, poster, alt }) {
	const fallback =
		"https://res.cloudinary.com/dgbngcvkl/image/upload/v1749538986/image-not-found_jj2enj.jpg";

	const tmdbUrl =
		poster && poster !== "null" && poster !== ""
			? poster.startsWith("http")
				? poster
				: `https://image.tmdb.org/t/p/w500${
						poster.startsWith("/") ? poster : `/${poster}`
				  }`
			: null;

	const [src, setSrc] = useState(tmdbUrl || fallback);
	const [triedWiki, setTriedWiki] = useState(false);

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
			} catch (e) {
				// No hay imagen wiki
			}
		}
		setSrc(fallback);
	};

	return (
		<img
			src={src}
			alt={alt || title || "Sin título"}
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
					console.error("Respuesta inesperada backend:", text);
					return;
				}
				const json = await resp.json();
				setData(json);

				// Inicializar formulario
				setForm((prev) => ({
					...prev,
					name: json.user.name,
					email: user.email,
				}));
			} catch (err) {
				console.error("Error al obtener perfil:", err);
			}
		};
		fetchProfile();
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		setSaving(true);
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
					text: result?.message || "Error al actualizar.",
					confirmButtonText: "Aceptar",
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
				title: "¡Éxito!",
				text: "Perfil actualizado con éxito.",
				confirmButtonText: "Aceptar",
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
				text: "Error de red.",
				confirmButtonText: "Aceptar",
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
			title: "¿Estás seguro?",
			text: "¿Quieres aplicar los cambios en tu perfil?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, aplicar cambios",
			cancelButtonText: "Cancelar",
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

	if (!user) return <p>Cargando usuario...</p>;
	if (!data) return <p>Cargando perfil...</p>;

	const { stats, lists } = data;
	const { total_hours, total_movies, total_series } = stats;
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
							alt="Avatar del usuario"
						/>
					</div>
					<div className="user-details">
						<h2>{user.name}</h2>
						<div className="stats">
							<span>{total_hours} Horas vistas</span>
							<span>{total_movies} Películas vistas</span>
							<span>{total_series} Series completas</span>
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
								alt="Visto"
								className="list-icon"
							/>
							<h3>Películas vistas</h3>
						</div>
						<div className="media-grid">
							{getList("películas vista").map((item) => (
								<a
									key={item.id}
									href={`detail-page?id=${item.id}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`Ver detalle de ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster={item.poster}
										alt={item.title || "Sin título"}
									/>
								</a>
							))}
						</div>
					</div>

					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240679/viewed_jwguww.png"
								alt="Visto"
								className="list-icon"
							/>
							<h3>Series vistas</h3>
						</div>
						<div className="media-grid">
							{getList("series vista").map((item) => (
								<a
									key={item.id}
									href={`detail-page?id=${item.id}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`Ver detalle de ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster={item.poster}
										alt={item.title || "Sin título"}
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
								alt="Por ver"
								className="list-icon"
							/>
							<h3>Películas por ver</h3>
						</div>
						<div className="media-grid">
							{getList("películas por ver").map((item) => (
								<a
									key={item.id}
									href={`detail-page?id=${item.id}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`Ver detalle de ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster={item.poster}
										alt={item.title || "Sin título"}
									/>
								</a>
							))}
						</div>
					</div>

					<div className="list-column">
						<div className="list-title">
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1750240554/to-see_kdabyr.png"
								alt="Por ver"
								className="list-icon"
							/>
							<h3>Series por ver</h3>
						</div>
						<div className="media-grid">
							{getList("series por ver").map((item) => (
								<a
									key={item.id}
									href={`detail-page?id=${item.id}`}
									className="poster-link"
									tabIndex={0}
									aria-label={`Ver detalle de ${
										item.title || item.name
									}`}
									data-title={item.title || item.name}
								>
									<PosterWithFallback
										title={item.title || item.name}
										poster={item.poster}
										alt={item.title || "Sin título"}
									/>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="profile-settings">
				<div className="inner-container">
					<h3>GESTIONAR PERFIL</h3>
					<div className="settings-form">
						<div className="left">
							<label>Nombre:</label>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Nombre completo..."
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
							<label>Contraseña actual:</label>
							<input
								type="password"
								name="current_password"
								value={form.current_password}
								onChange={handleChange}
								placeholder="Contraseña actual..."
							/>

							<label>Nueva contraseña:</label>
							<input
								type="password"
								name="new_password"
								value={form.new_password}
								onChange={handleChange}
								placeholder="Nueva contraseña..."
							/>
						</div>
					</div>

					<button
						className="apply-btn"
						onClick={confirmAndSubmit}
						disabled={saving}
					>
						{saving ? "Guardando..." : "APLICAR CAMBIOS"}
					</button>
				</div>
			</div>
		</div>
	);
}
