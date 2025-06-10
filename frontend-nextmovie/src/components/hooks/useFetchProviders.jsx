import { useEffect, useState } from "react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const PROVIDER_URL = "https://api.themoviedb.org/3/movie";

export function useFetchProviders(movies) {
	const [platformsByMovie, setPlatformsByMovie] = useState({});

	useEffect(() => {
		if (!movies || movies.length === 0) {
			setPlatformsByMovie({});
			return;
		}

		const headers = {
			Authorization: `Bearer ${TMDB_TOKEN}`,
			accept: "application/json",
		};

		const excludedIds = [1796, 2472];

		async function fetchProviders() {
			const providersData = {};
			await Promise.all(
				movies.map(async (movie) => {
					try {
						const res = await fetch(
							`${PROVIDER_URL}/${movie.id}/watch/providers?language=es-ES`,
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

		fetchProviders();
	}, [movies]);

	return platformsByMovie;
}
