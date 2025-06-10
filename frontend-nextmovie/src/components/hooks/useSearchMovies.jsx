import { useEffect, useState } from "react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const API_URL = "https://api.themoviedb.org/3/search/movie";

export function useSearchMovies(query) {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!query) return;

		const headers = {
			Authorization: `Bearer ${TMDB_TOKEN}`,
			accept: "application/json",
		};

		async function fetchMovies() {
			setLoading(true);
			setError(null);

			try {
				let response = await fetch(
					`${API_URL}?query=${encodeURIComponent(
						query
					)}&include_adult=false&language=es-ES`,
					{ headers }
				);
				let data = await response.json();

				if (!data.results?.length) {
					response = await fetch(
						`${API_URL}?query=${encodeURIComponent(
							query
						)}&include_adult=false&language=en-US`,
						{ headers }
					);
					data = await response.json();
				}

				setResults(data.results || []);
			} catch (err) {
				setError("Failed to fetch movies.");
				setResults([]);
			} finally {
				setLoading(false);
			}
		}

		fetchMovies();
	}, [query]);

	return { results, loading, error };
}
