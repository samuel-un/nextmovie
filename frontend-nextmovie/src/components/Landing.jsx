import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./Landing.css";

const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export default function Landing() {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLatestMovies = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					"https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1",
					{
						headers: {
							Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
							accept: "application/json",
						},
					}
				);
				const data = await response.json();
				setMovies(data.results.slice(0, 4));
			} catch (error) {
				setError(
					"No se pudieron cargar las películas. Intenta más tarde."
				);
				setMovies([]);
			} finally {
				setLoading(false);
			}
		};

		fetchLatestMovies();
	}, []);

	return (
		<div className="landing">
			{loading && <Loader />}

			<section className="hero">
				<div className="hero-content">
					<img
						src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749119590/NextMovie_logo_letras_y_icono_1_wth3st.png"
						alt="NextMovie Logo"
						className="hero-logo"
					/>
					<h1 className="hero-title">
						Your <strong>universe</strong> of{" "}
						<strong>movies</strong> and <strong>series</strong>, all
						in one place.
					</h1>
					<p className="hero-description">
						Discover what to watch, keep track of your favorites,
						and share your passion with the community.
					</p>
					<div className="hero-features">
						<div className="feature-item">
							🔍 Search for <strong>movies</strong> and{" "}
							<strong>series</strong>
						</div>
						<div className="feature-item">
							📋 Organize your <strong>watchlists</strong>
						</div>
						<div className="feature-item">
							⭐ <strong>Recommend</strong>, comment, and{" "}
							<strong>rate</strong>
						</div>
					</div>
					<button
						className="cta-button"
						onClick={() => navigate("/register")}
					>
						Join for free →
					</button>
				</div>
			</section>

			<section className="movies-section">
				<div className="movies-container">
					<h2 className="movies-title">Latest Movies and Series</h2>

					{error && <p className="error-message">{error}</p>}

					<div className="movies-grid" aria-live="polite">
						{!loading &&
							movies.map((movie) => (
								<div key={movie.id} className="movie-card">
									<img
										loading="lazy"
										src={
											movie.poster_path
												? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
												: "https://via.placeholder.com/300x450?text=No+Image"
										}
										alt={
											movie.title ||
											"Poster not available"
										}
										className="movie-poster"
									/>
									<div className="movie-info">
										<h3 className="movie-title">
											{movie.title}
										</h3>
										<span className="movie-year">
											{movie.release_date
												? movie.release_date.slice(0, 4)
												: ""}
										</span>
									</div>
								</div>
							))}
					</div>
				</div>
			</section>
		</div>
	);
}
