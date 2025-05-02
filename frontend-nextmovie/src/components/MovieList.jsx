import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieList = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/movies")
			.then((response) => {
				setMovies(response.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

	return (
		<div>
			<h2>Movies</h2>
			{movies.length === 0 ? (
				<div>No movies found.</div>
			) : (
				<ul>
					{movies.map((movie) => (
						<li key={movie.id_tmdb || movie.id}>{movie.title}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MovieList;
