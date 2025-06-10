import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResultsPage.css";

const TMDB_TOKEN =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzhjNzgwODM2NWE0OWMyNTdhZTU2M2M1N2NjNzI2MyIsIm5iZiI6MTc0OTEyMDA3Ni40MTkwMDAxLCJzdWIiOiI2ODQxNzQ0Y2YxM2FlNmJjMDNiZjEzOWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NIKxVQk8bRKowCEYVkTvFpXHfT5ZeS-9fIBOyVpaMvg";
const API_URL = "https://api.themoviedb.org/3/search/movie";
const PROVIDER_URL = "https://api.themoviedb.org/3/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

export default function SearchResults() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const query = queryParams.get("query");

	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [platformsByMovie, setPlatformsByMovie] = useState({});

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
					)}&include_adult=false&language=en-US`,
					{ headers }
				);
				const dataEs = await responseEs.json();

				let movies = dataEs.results;
				if (!movies || movies.length === 0) {
					const responseEn = await fetch(
						`${API_URL}?query=${encodeURIComponent(
							query
						)}&include_adult=false&language=en-US`,
						{ headers }
					);
					const dataEn = await responseEn.json();
					movies = dataEn.results || [];
				}
				setResults(movies);
				await fetchAllProviders(movies);
			} catch (error) {
				console.error("Error fetching data:", error);
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
								logo: `https://image.tmdb.org/t/p/original${p.logo_path}`,
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
		<div className="search-results-page">
			<div className="search-header">
				<h2>
					Search results for: <strong>{query}</strong>
				</h2>
				<p>{filteredResults.length} Titles found</p>
			</div>

			{loading ? (
				<p>Loading titles...</p>
			) : filteredResults.length === 0 ? (
				<p>No results found</p>
			) : (
				<div className="results-list">
					{filteredResults.map((movie) => (
						<div className="result-item" key={movie.id}>
							<img
								src={
									movie.poster_path
										? TMDB_IMAGE_BASE + movie.poster_path
										: "https://res.cloudinary.com/dgbngcvkl/image/upload/v1749538986/image-not-found_jj2enj.jpg"
								}
								alt={movie.title}
								className="poster"
							/>
							<div className="info">
								<div>
									<h3 className="title">{movie.title}</h3>
									<p className="year">
										{movie.release_date?.slice(0, 4)}
									</p>
									<Link
										to={`/detail-page/${movie.id}`}
										className="ver-ahora"
									>
										See more
									</Link>
									{platformsByMovie[movie.id]?.length > 0 && (
										<div className="available-on">
											<span className="available-label">
												Available with subscription at:
											</span>
											<div className="platforms-list">
												{platformsByMovie[movie.id].map(
													(p) => (
														<img
															key={p.id}
															src={p.logo}
															alt={p.name}
															title={p.name}
															className="platform-icon"
															loading="lazy"
														/>
													)
												)}
											</div>
										</div>
									)}
									<div className="ratings">
										<div className="ratings-top">
											<div className="rating">
												<a
													href={getIMDbUrl(movie)}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537104/IMDb-logo_f5ymwh.png"
														alt="IMDb"
														className="rating-logo"
													/>
												</a>
											</div>
											<div className="rating">
												<a
													href={getFilmAffinityUrl(
														movie
													)}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537104/filmaffinity-logo_zxet3o.png"
														alt="FilmAffinity"
														className="rating-logo"
													/>
												</a>
											</div>
										</div>

										<div className="ratings-bottom">
											<div className="rating">
												<img
													src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749537765/Tmdb-logo_pewsws.png"
													alt="TMDb"
													className="rating-logo"
												/>
												<span>
													{movie.vote_average &&
													movie.vote_average > 0
														? movie.vote_average.toFixed(
																1
														  )
														: "N/A"}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
