import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import PlatformList from "./PlatformList";
import "./DetailPage.css";

import { api } from "../store/useAuthStore";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const DetailPage = () => {
	const { media_type, id } = useParams();
	const [movie, setMovie] = useState(null);
	const [platforms, setPlatforms] = useState([]);
	const [error, setError] = useState(null);
	const [comments, setComments] = useState([]);
	const [inWatched, setInWatched] = useState(false);
	const [inToWatch, setInToWatch] = useState(false);
	const [trailerUrl, setTrailerUrl] = useState(null);
	const user = useAuthStore((state) => state.user);
	const [showAllComments, setShowAllComments] = useState(false);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [commentRating, setCommentRating] = useState("");

	const showAlert = (title, text, icon = "info") => {
		Swal.fire({
			title,
			text,
			icon,
			confirmButtonText: "OK",
			customClass: {
				popup: "swal2-popup",
				title: "swal2-title",
				content: "swal2-content",
				confirmButton: "swal2-confirm",
			},
		});
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!commentText || commentRating === "") return;

		try {
			await api.post("/comments", {
				movie_id: parseInt(id),
				comment_text: commentText,
				comment_rating: commentRating,
				commented_at: new Date().toISOString(),
			});

			setCommentText("");
			setCommentRating("");
			setShowCommentForm(false);

			const newComment = {
				id: Date.now(),
				user: { name: user.name },
				text: commentText,
				rating: commentRating,
				commented_at: new Date().toISOString(),
				media_type: normalizedMediaType,
			};
			setComments((prev) => [newComment, ...prev]);

			showAlert(
				"Comment posted",
				"Your comment has been successfully added.",
				"success"
			);
		} catch (err) {
			console.error("Error posting comment:", err);
			showAlert("Error", "Failed to post comment.", "error");
		}
	};

	const normalizeType = (type) => {
		if (!type) return "";
		const t = type.toLowerCase();
		if (t === "serie" || t === "tv_show" || t === "tv") return "series";
		if (t === "pelicula" || t === "movie" || t === "film") return "movie";
		return t;
	};

	const normalizedMediaType = normalizeType(media_type);

	useEffect(() => {
		if (!media_type || !id) {
			setError("Missing parameters in the URL");
			return;
		}

		const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

		const headers = {
			Authorization: `Bearer ${TMDB_TOKEN}`,
			Accept: "application/json",
		};

		const fetchDetails = async () => {
			try {
				const res = await axios.get(
					`https://api.themoviedb.org/3/${media_type}/${id}?append_to_response=credits,videos`,
					{ headers }
				);
				setMovie({ ...res.data, type: normalizedMediaType });

				const trailer = res.data.videos.results.find(
					(vid) => vid.type === "Trailer" && vid.site === "YouTube"
				);
				if (trailer) {
					setTrailerUrl(
						`https://www.youtube.com/watch?v=${trailer.key}`
					);
				} else {
					setTrailerUrl(null);
				}

				const provRes = await axios.get(
					`https://api.themoviedb.org/3/${media_type}/${id}/watch/providers`,
					{ headers }
				);
				const flatrate = provRes.data.results?.ES?.flatrate || [];
				const excludedIds = [1796, 2472];
				const mapped = flatrate
					.filter((p) => !excludedIds.includes(p.provider_id))
					.map((p) => ({
						id: p.provider_id,
						name: p.provider_name,
						logo: `${TMDB_IMAGE_BASE}/original${p.logo_path}`,
					}));
				setPlatforms(mapped);
			} catch (error) {
				console.error("Error loading details:", error);
				setError("Failed to load movie or series.");
			}
		};

		const fetchComments = async () => {
			try {
				const res = await api.get(`/movies/${id}/comments`);
				const filtered = res.data.filter(
					(c) => normalizeType(c.media_type) === normalizedMediaType
				);
				const sorted = filtered.sort(
					(a, b) =>
						new Date(b.commented_at) - new Date(a.commented_at)
				);
				setComments(sorted);
			} catch (err) {
				console.error("Error loading comments:", err);
			}
		};

		const fetchUserListsAndCheckMovie = async () => {
			if (!user) {
				setInWatched(false);
				setInToWatch(false);
				return;
			}

			try {
				const res = await api.get(`/users/${user.id}/profile-data`);
				const lists = res.data.lists;

				const watchedListName =
					normalizedMediaType === "movie"
						? "Watched movies"
						: "Watched series";
				const toWatchListName =
					normalizedMediaType === "movie"
						? "Movies to watch"
						: "Series to watch";

				const watchedList = lists.find(
					(l) => l.name === watchedListName
				);
				const toWatchList = lists.find(
					(l) => l.name === toWatchListName
				);

				const isInWatched = watchedList?.items.some(
					(item) =>
						item.tmdbId === parseInt(id) &&
						normalizeType(item.media_type) === normalizedMediaType
				);
				const isInToWatch = toWatchList?.items.some(
					(item) =>
						item.tmdbId === parseInt(id) &&
						normalizeType(item.media_type) === normalizedMediaType
				);

				setInWatched(Boolean(isInWatched));
				setInToWatch(Boolean(isInToWatch));
			} catch (err) {
				console.error("Error loading user lists:", err);
				setInWatched(false);
				setInToWatch(false);
			}
		};

		fetchDetails();
		fetchComments();
		fetchUserListsAndCheckMovie();
	}, [media_type, id, user]);

	const toggleList = async (type) => {
		if (!user) {
			showAlert(
				"Access restricted",
				"You must be logged in to use this feature",
				"warning"
			);
			return;
		}

		try {
			const listNameMap = {
				watched:
					normalizedMediaType === "movie"
						? "Watched movies"
						: "Watched series",
				to_watch:
					normalizedMediaType === "movie"
						? "Movies to watch"
						: "Series to watch",
			};
			const listName = listNameMap[type];
			if (!listName) return;

			const res = await api.get(`/users/${user.id}/profile-data`);
			const lists = res.data.lists;
			const targetList = lists.find((l) => l.name === listName);
			if (!targetList) {
				showAlert(
					"List not found",
					`The list '${listName}' was not found`,
					"error"
				);
				return;
			}

			if (
				(type === "watched" && inWatched) ||
				(type === "to_watch" && inToWatch)
			) {
				const item = targetList.items.find(
					(item) =>
						item.tmdbId === parseInt(id) &&
						normalizeType(item.media_type) === normalizedMediaType
				);
				if (!item) {
					showAlert("Error", "Item not found in the list", "error");
					return;
				}
				await api.delete(`/user-list-items/${item.id}`, {
					data: { user_id: user.id },
				});
				if (type === "watched") setInWatched(false);
				else setInToWatch(false);
				showAlert(
					"Updated",
					"It has been removed from your list.",
					"success"
				);
			} else {
				const title = movie?.title || movie?.name || "Untitled";
				const backendType =
					normalizedMediaType === "series" ? "series" : "movie";
				await api.post("/user-list-items", {
					list_id: targetList.id,
					movie_id: parseInt(id),
					title,
					type: backendType,
				});
				if (type === "watched") setInWatched(true);
				else setInToWatch(true);
				showAlert(
					"Updated",
					"It has been added to your list.",
					"success"
				);
			}
		} catch (err) {
			console.error("Error modifying list:", err);
			showAlert(
				"Error",
				"There was an issue updating the list.",
				"error"
			);
		}
	};

	if (error) return <div className="detail-error">{error}</div>;
	if (!movie) return <div className="detail-loading">Loading...</div>;

	const {
		type: rawType,
		title,
		name,
		poster_path,
		backdrop_path,
		release_date,
		first_air_date,
		runtime,
		credits,
		vote_average,
		number_of_seasons,
		number_of_episodes,
		created_by,
		production_countries,
		production_companies,
		original_language,
		status,
	} = movie;

	const normalizedType = normalizeType(rawType);

	const displayTitle = title || name || "Untitled";

	const releaseDate = release_date || first_air_date || "";
	const releaseYear = releaseDate
		? new Date(releaseDate).getFullYear()
		: "N/A";

	let durationFormatted = "N/A";
	if (normalizedType === "movie" && runtime) {
		durationFormatted = `${Math.floor(runtime / 60)}h ${runtime % 60}min`;
	}

	const backgroundImage = `${TMDB_IMAGE_BASE}/original${backdrop_path}`;
	const posterImage = `${TMDB_IMAGE_BASE}/w500${poster_path}`;

	const directors =
		normalizedType === "movie"
			? credits?.crew
					?.filter((p) => p.job === "Director")
					.map((d) => d.name)
					.join(", ") || "Not available"
			: null;

	const writers =
		normalizedType === "movie"
			? credits?.crew
					?.filter((p) => p.department === "Writing")
					.map((w) => w.name)
					.slice(0, 3)
					.join(", ") || "Not available"
			: null;

	const creatorsNames =
		normalizedType === "tv"
			? created_by?.map((c) => c.name).join(", ") || "Not available"
			: null;

	const productionCountryName = production_countries?.[0]?.name || "Unknown";

	const productionCompaniesNames =
		production_companies
			?.slice(0, 2)
			.map((c) => c.name)
			.join(" + ") || "Not available";

	return (
		<div
			className="detail-page"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="detail-overlay">
				<div className="detail-container">
					<img
						className="detail-poster"
						src={posterImage}
						alt={displayTitle}
					/>
					<div className="detail-content">
						<h1 className="detail-title">
							{displayTitle}{" "}
							<span className="age-badge">+12</span>
						</h1>

						<div className="detail-ratings">
							<p className="detail-rating-icon">
								IMDb: {vote_average?.toFixed(1) ?? "N/A"}
							</p>
						</div>

						{platforms.length > 0 && (
							<PlatformList platforms={platforms} />
						)}

						<div className="detail-tech-sheet">
							<h4>Technical Details</h4>
							<p>
								<strong>Release:</strong> {releaseYear}
							</p>
							{normalizedType === "movie" && (
								<>
									<p>
										<strong>Duration:</strong>{" "}
										{durationFormatted}
									</p>
									<p>
										<strong>Director:</strong> {directors}
									</p>
									<p>
										<strong>Writers:</strong> {writers}
									</p>
								</>
							)}
							{normalizedType === "series" && (
								<>
									<p>
										<strong>Seasons:</strong>{" "}
										{number_of_seasons}
									</p>
									<p>
										<strong>Episodes:</strong>{" "}
										{number_of_episodes}
									</p>
									<p>
										<strong>Creators:</strong>{" "}
										{creatorsNames}
									</p>
								</>
							)}
							<p>
								<strong>Production Country:</strong>{" "}
								{productionCountryName}
							</p>
							<p>
								<strong>Companies:</strong>{" "}
								{productionCompaniesNames}
							</p>
							<p>
								<strong>Original Language:</strong>{" "}
								{original_language}
							</p>
							<p>
								<strong>Status:</strong> {status}
							</p>
						</div>

						<div className="detail-buttons">
							<button
								onClick={() => toggleList("watched")}
								className={inWatched ? "btn-added" : ""}
							>
								{inWatched
									? "Remove from Watched"
									: "Add to Watched"}
							</button>
							<button
								onClick={() => toggleList("to_watch")}
								className={inToWatch ? "btn-added" : ""}
							>
								{inToWatch
									? "Remove from To Watch"
									: "Add to To Watch"}
							</button>
						</div>

						{trailerUrl && (
							<div className="detail-trailer">
								<h4>Trailer</h4>
								<iframe
									width="560"
									height="315"
									src={trailerUrl.replace(
										"watch?v=",
										"embed/"
									)}
									title="Trailer"
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
								/>
							</div>
						)}

						<div className="detail-comments">
							<h4>Comments coming soon...</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailPage;
