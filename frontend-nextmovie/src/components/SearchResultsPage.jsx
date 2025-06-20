import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResultsPage.css";
import PlatformList from "./PlatformList";

import { tailspin } from "ldrs";
tailspin.register();

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const API_URL_MOVIE = "https://api.themoviedb.org/3/search/movie";
const API_URL_TV = "https://api.themoviedb.org/3/search/tv";
const PROVIDER_URL_MOVIE = "https://api.themoviedb.org/3/movie";
const PROVIDER_URL_TV = "https://api.themoviedb.org/3/tv";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformsById, setPlatformsById] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults(query) {
      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      };

      try {
        const [movieResp, tvResp] = await Promise.all([
          fetch(
            `${API_URL_MOVIE}?query=${encodeURIComponent(
              query
            )}&include_adult=false&language=en-US`,
            { headers }
          ),
          fetch(
            `${API_URL_TV}?query=${encodeURIComponent(query)}&language=en-US`,
            { headers }
          ),
        ]);
        const movieData = await movieResp.json();
        const tvData = await tvResp.json();

        let combinedResults = [
          ...(movieData.results || []).map((item) => ({
            ...item,
            media_type: "movie",
          })),
          ...(tvData.results || []).map((item) => ({
            ...item,
            media_type: "tv",
          })),
        ];

        if (combinedResults.length === 0) {
          const [movieRespEs, tvRespEs] = await Promise.all([
            fetch(
              `${API_URL_MOVIE}?query=${encodeURIComponent(
                query
              )}&include_adult=false&language=es-ES`,
              { headers }
            ),
            fetch(
              `${API_URL_TV}?query=${encodeURIComponent(query)}&language=es-ES`,
              { headers }
            ),
          ]);
          const movieDataEs = await movieRespEs.json();
          const tvDataEs = await tvRespEs.json();

          combinedResults = [
            ...(movieDataEs.results || []).map((item) => ({
              ...item,
              media_type: "movie",
            })),
            ...(tvDataEs.results || []).map((item) => ({
              ...item,
              media_type: "tv",
            })),
          ];
        }

        setResults(combinedResults);
        await fetchAllProviders(combinedResults);
      } catch {
        setError("Oops! Something went wrong fetching the results.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAllProviders(items) {
      const headers = {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      };

      const excludedIds = [1796, 2472];
      const providersData = {};

      await Promise.all(
        items.map(async (item) => {
          try {
            const baseUrl =
              item.media_type === "tv" ? PROVIDER_URL_TV : PROVIDER_URL_MOVIE;

            const res = await fetch(
              `${baseUrl}/${item.id}/watch/providers?language=en-US`,
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
            providersData[item.id] = mapped;
          } catch {
            providersData[item.id] = [];
          }
        })
      );

      setPlatformsById(providersData);
    }

    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const filteredResults = results.filter((item) => {
    const noImage = !item.poster_path && !item.backdrop_path;
    const noRating = !item.vote_average || item.vote_average === 0;
    return !(noImage && noRating);
  });

  const getTitle = (item) => item.title || item.name || "Untitled";
  const getYear = (item) => {
    const date = item.release_date || item.first_air_date;
    return date ? date.slice(0, 4) : "";
  };
  const getIMDbUrl = (item) =>
    `https://www.imdb.com/find?q=${encodeURIComponent(getTitle(item))}`;
  const getFilmAffinityUrl = (item) =>
    `https://www.filmaffinity.com/es/search.php?stext=${encodeURIComponent(
      getTitle(item)
    )}`;

  return (
    <section className="search-results-page" aria-label="Search results page">
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
          {filteredResults.map((item) => (
            <ResultItem
              key={`${item.media_type}-${item.id}`}
              item={item}
              platforms={platformsById[item.id]}
              getIMDbUrl={getIMDbUrl}
              getFilmAffinityUrl={getFilmAffinityUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ResultItem({ item, platforms, getIMDbUrl, getFilmAffinityUrl }) {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const altText = `Poster of ${
    item.media_type === "tv" ? "series" : "movie"
  } ${title}`;

  return (
    <article
      className="result-item"
      aria-label={`${item.media_type === "tv" ? "Series" : "Movie"}: ${title}`}
    >
      <img
        src={
          item.poster_path
            ? `${TMDB_IMAGE_BASE}/w300${item.poster_path}`
            : "https://res.cloudinary.com/dgbngcvkl/image/upload/v1749538986/image-not-found_jj2enj.jpg"
        }
        srcSet={
          item.poster_path
            ? `${TMDB_IMAGE_BASE}/w300${item.poster_path} 300w, ${TMDB_IMAGE_BASE}/w780${item.poster_path} 780w`
            : null
        }
        sizes="(max-width: 600px) 300px, 780px"
        alt={altText}
        className="poster"
        loading="lazy"
      />
      <div className="info">
        <div>
          <h3 className="title">{title}</h3>
          <p className="year">{year}</p>
          <Link
            to={`/detail-page/${item.media_type}/${item.id}`}
            className="ver-ahora"
            aria-label={`See more details about ${title}`}
          >
            See more
          </Link>

          {platforms?.length > 0 && <PlatformList platforms={platforms} />}

          <Ratings
            item={item}
            getIMDbUrl={getIMDbUrl}
            getFilmAffinityUrl={getFilmAffinityUrl}
          />
        </div>
      </div>
    </article>
  );
}

function Ratings({ item, getIMDbUrl, getFilmAffinityUrl }) {
  const title = item.title || item.name || "Untitled";

  return (
    <div className="ratings">
      <div className="ratings-top">
        <div className="rating">
          <a
            href={getIMDbUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on IMDb`}
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
            href={getFilmAffinityUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on FilmAffinity`}
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
            {item.vote_average && item.vote_average > 0
              ? item.vote_average.toFixed(1)
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

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
      <l-tailspin size="40" stroke="5" speed="0.9" color="#9f42c6" />
    </div>
  );
}
