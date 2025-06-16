import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResultsPage.css";

// Importa y registra el spinner tailspin una vez
import { tailspin } from "ldrs";
tailspin.register();

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const API_URL = "https://api.themoviedb.org/3/search/movie";
const PROVIDER_URL = "https://api.themoviedb.org/3/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export default function SearchResults() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const query = queryParams.get("query");

	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [platformsByMovie, setPlatformsByMovie] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchMovies(query) {
			setLoading(true);
			setError(null);

			const headers = {
				Authorization: `Bearer ${TMDB_TOKEN}`,
				accept: "application/json",
			};

			try {
				// Primero buscar en inglés
				let response = await fetch(
					`${API_URL}?query=${encodeURIComponent(
						query
					)}&include_adult=false&language=en-US`,
					{ headers }
				);
				let data = await response.json();
				let movies = data.results;

				// Si no hay resultados, buscar en español
				if (!movies || movies.length === 0) {
					response = await fetch(
						`${API_URL}?query=${encodeURIComponent(
							query
						)}&include_adult=false&language=es-ES`,
						{ headers }
					);
					data = await response.json();
					movies = data.results || [];
				}

				setResults(movies);
				await fetchAllProviders(movies);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Oops! Something went wrong fetching the movies.");
				setResults([]);
			} finally {
				setLoading(false);
			}
		}

		async function fetchAllProviders(movies) {
			const headers = {
				Authorization: `Bearer ${TMDB_TOKEN}`,
				accept: "application/json",
			};

			const excludedIds = [1796, 2472];
			const providersData = {};
			await Promise.all(
				movies.map(async (movie) => {
					try {
						const res = await fetch(
							`${PROVIDER_URL}/${movie.id}/watch/providers?language=en-US`,
							{ headers }
						);
						const data = await res.json();
						const flatrate = data.results?.ES?.flatrate || [];
						const mapped = flatrate
							.filter((p) => !excludedIds.includes(p.provider_id))
							.map((p) => ({
								id: p.provider_id,
								name: p.provider_name,
								logo: `${TMDB_IMAGE_BASE}/original${p.logo_path}`,
							}));
						providersData[movie.id] = mapped;
					} catch {
						providersData[movie.id] = [];
					}
				})
			);
			setPlatformsByMovie(providersData);
		}

		if (query) {
			fetchMovies(query);
		}
	}, [query]);

	const filteredResults = results.filter((movie) => {
		const noImage = !movie.poster_path;
		const noRating = !movie.vote_average || movie.vote_average === 0;
		return !(noImage && noRating);
	});

	const getIMDbUrl = (movie) =>
		`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
	const getFilmAffinityUrl = (movie) =>
		`https://www.filmaffinity.com/es/search.php?stext=${encodeURIComponent(
			movie.title
		)}`;

	return (
		<section
			className="search-results-page"
			aria-label="Search results page"
		>
			<header className="search-header">
				<h2>
					Search results for: <strong>{query}</strong>
				</h2>
				<p>{filteredResults.length} Titles found</p>
			</header>

			{error && (
				<p className="error-message" role="alert">
					{error}
				</p>
			)}

			{loading ? (
				<Spinner />
			) : filteredResults.length === 0 ? (
				<p>No results found</p>
			) : (
				<div className="results-list">
					{filteredResults.map((movie) => (
						<ResultItem
							key={movie.id}
							movie={movie}
							platforms={platformsByMovie[movie.id]}
							getIMDbUrl={getIMDbUrl}
							getFilmAffinityUrl={getFilmAffinityUrl}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function ResultItem({ movie, platforms, getIMDbUrl, getFilmAffinityUrl }) {
	return (
		<article className="result-item" aria-label={`Movie: ${movie.title}`}>
			<img
				src={
					movie.poster_path
						? `${TMDB_IMAGE_BASE}/w300${movie.poster_path}`
						: "https://res.cloudinary.com/dgbngcvkl/image/upload/v1749538986/image-not-found_jj2enj.jpg"
				}
				srcSet={
					movie.poster_path
						? `${TMDB_IMAGE_BASE}/w300${movie.poster_path} 300w, ${TMDB_IMAGE_BASE}/w780${movie.poster_path} 780w`
						: null
				}
				sizes="(max-width: 600px) 300px, 780px"
				alt={`Poster of movie ${movie.title}`}
				className="poster"
				loading="lazy"
			/>
			<div className="info">
				<div>
					<h3 className="title">{movie.title}</h3>
					<p className="year">{movie.release_date?.slice(0, 4)}</p>
					<Link
						to={`/detail-page/${movie.id}`}
						className="ver-ahora"
						aria-label={`See more details about ${movie.title}`}
					>
						See more
					</Link>

					{platforms?.length > 0 && (
						<PlatformList platforms={platforms} />
					)}

					<Ratings
						movie={movie}
						getIMDbUrl={getIMDbUrl}
						getFilmAffinityUrl={getFilmAffinityUrl}
					/>
				</div>
			</div>
		</article>
	);
}

function PlatformList({ platforms }) {
	return (
		<div className="available-on">
			<span className="available-label">
				Available with subscription at:
			</span>
			<div className="platforms-list">
				{platforms.map((p) => (
					<img
						key={p.id}
						src={p.logo}
						alt={`Logo of ${p.name}`}
						title={p.name}
						className="platform-icon"
						loading="lazy"
						aria-label={p.name}
					/>
				))}
			</div>
		</div>
	);
}

function Ratings({ movie, getIMDbUrl, getFilmAffinityUrl }) {
	return (
		<div className="ratings">
			<div className="ratings-top">
				<div className="rating">
					<a
						href={getIMDbUrl(movie)}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View ${movie.title} on IMDb`}
					>
						<img
							src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537104/IMDb-logo_f5ymwh.png"
							alt="IMDb logo"
							className="rating-logo"
							loading="lazy"
						/>
					</a>
				</div>
				<div className="rating">
					<a
						href={getFilmAffinityUrl(movie)}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View ${movie.title} on FilmAffinity`}
					>
						<img
							src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537104/filmaffinity-logo_zxet3o.png"
							alt="FilmAffinity logo"
							className="rating-logo"
							loading="lazy"
						/>
					</a>
				</div>
			</div>

			<div className="ratings-bottom">
				<div className="rating">
					<img
						src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537765/Tmdb-logo_pewsws.png"
						alt="TMDb logo"
						className="rating-logo"
						loading="lazy"
					/>
					<span>
						{movie.vote_average && movie.vote_average > 0
							? movie.vote_average.toFixed(1)
							: "N/A"}
					</span>
				</div>
			</div>
		</div>
	);
}

// Aquí el spinner con el componente web l-tailspin
function Spinner() {
	return (
		<div
			className="spinner"
			role="status"
			aria-live="polite"
			aria-label="Loading"
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "2rem",
			}}
		>
			<l-tailspin
				size="40"
				stroke="5"
				speed="0.9"
				color="#9f42c6
"
			/>
		</div>
	);
}
