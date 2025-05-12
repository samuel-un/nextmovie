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

	if (loading) return <div>Loading movies...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="movie-list">
			<h2>Movie List</h2>
			{movies.length === 0 ? (
				<div>No movies found.</div>
			) : (
				<ul>
					{movies.map((movie) => (
						<li key={movie.id}>
							<strong>{movie.title}</strong>
							{movie.year && <> ({movie.year})</>}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MovieList;
