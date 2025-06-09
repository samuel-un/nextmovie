import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResultsPage.css"; 

export default function SearchResults() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const query = queryParams.get("query");

	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);

	const API_URL = "https://api.themoviedb.org/3/search/movie";
	const TMDB_TOKEN =
		"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzhjNzgwODM2NWE0OWMyNTdhZTU2M2M1N2NjNzI2MyIsIm5iZiI6MTc0OTEyMDA3Ni40MTkwMDAxLCJzdWIiOiI2ODQxNzQ0Y2YxM2FlNmJjMDNiZjEzOWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NIKxVQk8bRKowCEYVkTvFpXHfT5ZeS-9fIBOyVpaMvg";

	useEffect(() => {
		async function fetchMovies(query) {
			setLoading(true);

			const headers = {
				Authorization: `Bearer ${TMDB_TOKEN}`,
				accept: "application/json",
			};

			try {
				const responseEs = await fetch(
					`${API_URL}?query=${encodeURIComponent(
						query
					)}&include_adult=false&language=es-ES`,
					{ headers }
				);
				const dataEs = await responseEs.json();

				if (dataEs.results && dataEs.results.length > 0) {
					setResults(dataEs.results);
				} else {
					// Fallback to English
					const responseEn = await fetch(
						`${API_URL}?query=${encodeURIComponent(
							query
						)}&include_adult=false&language=en-US`,
						{ headers }
					);
					const dataEn = await responseEn.json();
					setResults(dataEn.results || []);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				setResults([]);
			} finally {
				setLoading(false);
			}
		}

		if (query) {
			fetchMovies(query);
		}
	}, [query]);

	return (
		<div
			className="search-results"
			style={{
				backgroundColor: "#060D17",
				color: "#FFFFFF",
				minHeight: "100vh",
				padding: "2rem",
			}}
		>
			<h2 style={{ marginBottom: "0.5rem" }}>
				Resultados de búsqueda para: <strong>{query}</strong>
			</h2>
			<p style={{ marginBottom: "2rem" }}>
				{results.length} Títulos encontrados
			</p>

			{loading ? (
				<p>Cargando...</p>
			) : (
				<div
					className="results-grid"
					style={{
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fill, minmax(220px, 1fr))",
						gap: "2rem",
					}}
				>
					{results.map((movie) => (
						<div
							key={movie.id}
							className="movie-card"
							style={{
								backgroundColor: "#0F1623",
								padding: "1rem",
								borderRadius: "16px",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
							}}
						>
							<img
								src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
								alt={movie.title}
								style={{ width: "100%", borderRadius: "12px" }}
							/>
							<h3
								style={{
									fontSize: "1.2rem",
									marginTop: "1rem",
								}}
							>
								{movie.title}
							</h3>
							<p style={{ fontSize: "0.9rem", color: "#ccc" }}>
								{movie.release_date?.slice(0, 4)}
							</p>

							<Link
								to={`/detail-page/${movie.id}`}
								className="watch-button"
								style={{
									display: "inline-block",
									marginTop: "0.8rem",
									padding: "0.5rem 1rem",
									backgroundColor: "#9F42C6",
									color: "#FFF",
									borderRadius: "8px",
									textDecoration: "none",
								}}
							>
								Ver ahora
							</Link>

							<div
								style={{
									marginTop: "1rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem",
								}}
							>
								<img
									src="/logos/netflix-n-icon.png"
									alt="Netflix"
									style={{ width: "24px", height: "24px" }}
								/>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
									}}
								>
									<img
										src="/logos/imdb.png"
										alt="IMDB"
										style={{ width: "24px" }}
									/>
									<span>
										{movie.vote_average?.toFixed(1)}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
									}}
								>
									<img
										src="/logos/filmaffinity.png"
										alt="Filmaffinity"
										style={{ width: "24px" }}
									/>
									<span>--</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
