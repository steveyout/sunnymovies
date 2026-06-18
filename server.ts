/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MOCK_MOVIES, STREAMING_PLATFORMS } from './server_mock_data';
import { Movie, StreamingPlatform } from './src/types';

// Run dotenv config to load custom keys
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const IS_TMDB_ACTIVE = TMDB_API_KEY.trim().length > 0;

// Log initialization status
console.log(`[SunnyMovies Config] TMDB Integration Active: ${IS_TMDB_ACTIVE ? 'YES (Live API mode)' : 'NO (Graceful High-Fidelity Mock mode)'}`);

// Support JSON routing
app.use(express.json());

// Helper: attach random popular streaming platforms to any TMDB movie result
function attachPopularStreamingPlatforms(movieTitle: string): StreamingPlatform[] {
  const platforms = Object.values(STREAMING_PLATFORMS);
  // Pick 1 to 3 platforms deterministically based on title length or random offsets
  const seed = movieTitle.length;
  const count = (seed % 3) + 1; // 1, 2, or 3
  const results: StreamingPlatform[] = [];
  
  for (let i = 0; i < count; i++) {
    const pIndex = (seed + i * 7) % platforms.length;
    const platform = platforms[pIndex];
    if (!results.some(p => p.name === platform.name)) {
      results.push(platform);
    }
  }
  return results;
}

// Map TMDB raw movies to our Movie schema
function mapTMDBMovie(tmdb: any): Movie {
  const genresMap: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
  };

  const movieGenres = (tmdb.genre_ids || [])
    .map((gid: number) => genresMap[gid])
    .filter(Boolean) as string[];

  const poster = tmdb.poster_path 
    ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80";
    
  const backdrop = tmdb.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  return {
    id: tmdb.id,
    title: tmdb.title,
    overview: tmdb.overview || "No review available for this title.",
    poster_path: poster,
    backdrop_path: backdrop,
    release_date: tmdb.release_date || "2024-01-01",
    vote_average: Math.round((tmdb.vote_average || 7.0) * 10) / 10,
    vote_count: tmdb.vote_count || 120,
    genres: movieGenres.length > 0 ? movieGenres : ["General"],
    runtime: tmdb.runtime || 120,
    rating: tmdb.adult ? "NC-17" : "PG-13",
    category: movieGenres[0] || "General",
    streaming_platforms: attachPopularStreamingPlatforms(tmdb.title)
  };
}

// Map TMDB raw TV Shows to our Movie schema
function mapTMDBTVShow(tmdb: any): Movie {
  const genresMap: Record<number, string> = {
    10759: "Action", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids", 9648: "Mystery",
    10763: "News", 10764: "Reality", 10765: "Sci-Fi", 10766: "Soap",
    10767: "Talk", 10768: "War", 37: "Western"
  };

  const tvGenres = (tmdb.genre_ids || [])
    .map((gid: number) => genresMap[gid])
    .filter(Boolean) as string[];

  const poster = tmdb.poster_path 
    ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80";
    
  const backdrop = tmdb.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

  const name = tmdb.name || tmdb.original_name || "Untitled Show";

  return {
    id: tmdb.id,
    title: name,
    overview: tmdb.overview || "No review available for this title.",
    poster_path: poster,
    backdrop_path: backdrop,
    release_date: tmdb.first_air_date || "2024-01-01",
    vote_average: Math.round((tmdb.vote_average || 7.0) * 10) / 10,
    vote_count: tmdb.vote_count || 120,
    genres: tvGenres.length > 0 ? tvGenres : ["TV Show"],
    runtime: (tmdb.episode_run_time && tmdb.episode_run_time[0]) || 45,
    rating: tmdb.adult ? "NC-17" : "TV-14",
    category: tvGenres[0] || "TV Show",
    is_tv_show: true,
    streaming_platforms: attachPopularStreamingPlatforms(name)
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// API Health / Config Info
app.get('/api/config', (req, res) => {
  res.json({
    appName: "SunnyMovies",
    tmdb_configured: IS_TMDB_ACTIVE,
    system_time: new Date().toISOString(),
    popular_platforms_count: Object.keys(STREAMING_PLATFORMS).length
  });
});

// Trending Movies and Shows
app.get('/api/movies/trending', async (req, res) => {
  if (IS_TMDB_ACTIVE) {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`)
      ]);
      
      const moviesData = moviesRes.ok ? await moviesRes.json() : { results: [] };
      const tvData = tvRes.ok ? await tvRes.json() : { results: [] };
      
      const mappedMovies = (moviesData.results || []).slice(0, 10).map(mapTMDBMovie);
      const mappedTv = (tvData.results || []).slice(0, 10).map(mapTMDBTVShow);
      
      const results: Movie[] = [];
      const maxLength = Math.max(mappedMovies.length, mappedTv.length);
      for (let i = 0; i < maxLength; i++) {
        if (i < mappedMovies.length) results.push(mappedMovies[i]);
        if (i < mappedTv.length) results.push(mappedTv[i]);
      }
      
      return res.json(results.slice(0, 15));
    } catch (err) {
      console.error("TMDB Trending Fetch Error, using mock:", err);
    }
  }
  // Fallback to trending mock releases
  res.json(MOCK_MOVIES.filter(m => m.is_trending));
});

// Popular Movies and Shows
app.get('/api/movies/popular', async (req, res) => {
  if (IS_TMDB_ACTIVE) {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}`)
      ]);
      
      const moviesData = moviesRes.ok ? await moviesRes.json() : { results: [] };
      const tvData = tvRes.ok ? await tvRes.json() : { results: [] };
      
      const mappedMovies = (moviesData.results || []).slice(0, 10).map(mapTMDBMovie);
      const mappedTv = (tvData.results || []).slice(0, 10).map(mapTMDBTVShow);
      
      const results: Movie[] = [];
      const maxLength = Math.max(mappedMovies.length, mappedTv.length);
      for (let i = 0; i < maxLength; i++) {
        if (i < mappedMovies.length) results.push(mappedMovies[i]);
        if (i < mappedTv.length) results.push(mappedTv[i]);
      }
      
      return res.json(results.slice(0, 20));
    } catch (err) {
      console.error("TMDB Popular Fetch Error, using mock:", err);
    }
  }
  // Fallback to popular mock releases
  res.json(MOCK_MOVIES.filter(m => m.is_popular));
});

// Category Filter Endpoint
app.get('/api/movies/category/:category', async (req, res) => {
  const { category } = req.params;
  
  if (IS_TMDB_ACTIVE) {
    // Maps category text to TMDB genre IDs
    // Movies genre IDs
    const movieCategoryMap: Record<string, number> = {
      "sci-fi": 878, "action": 28, "comedy": 35, "drama": 18, "romance": 10749
    };
    // TV show genre IDs
    const tvCategoryMap: Record<string, number> = {
      "sci-fi": 10765, "action": 10759, "comedy": 35, "drama": 18, "romance": 10749
    };
    
    const movieGenreId = movieCategoryMap[category.toLowerCase()];
    const tvGenreId = tvCategoryMap[category.toLowerCase()];
    
    try {
      const requests: Promise<any>[] = [];
      if (movieGenreId) {
        requests.push(fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${movieGenreId}`).then(r => r.json()));
      }
      if (tvGenreId) {
        requests.push(fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${tvGenreId}`).then(r => r.json()));
      }
      
      const dataResponses = await Promise.all(requests);
      const movieResults = movieGenreId && dataResponses[0] ? (dataResponses[0].results || []).slice(0, 8).map(mapTMDBMovie) : [];
      const tvResults = tvGenreId && (movieGenreId ? dataResponses[1] : dataResponses[0]) ? ((movieGenreId ? dataResponses[1] : dataResponses[0]).results || []).slice(0, 8).map(mapTMDBTVShow) : [];
      
      const combined: Movie[] = [];
      const len = Math.max(movieResults.length, tvResults.length);
      for (let i = 0; i < len; i++) {
        if (i < movieResults.length) combined.push(movieResults[i]);
        if (i < tvResults.length) combined.push(tvResults[i]);
      }
      
      return res.json(combined.slice(0, 16));
    } catch (err) {
      console.error(`TMDB Category Fetch Error for ${category}, fallback to mock:`, err);
    }
  }

  // Live filter of mock movies based on input category (case insensitive match)
  const filtered = MOCK_MOVIES.filter(m => {
    return m.category?.toLowerCase() === category.toLowerCase() || 
           m.genres.some(g => g.toLowerCase() === category.toLowerCase());
  });
  res.json(filtered);
});

// Search Movies and Shows
app.get('/api/movies/search', async (req, res) => {
  const query = (req.query.q || '').toString().trim();
  if (!query) {
    return res.json([]);
  }

  if (IS_TMDB_ACTIVE) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("TMDB Search Fail");
      const data = await response.json();
      const results = (data.results || [])
        .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
        .map((item: any) => item.media_type === "tv" ? mapTMDBTVShow(item) : mapTMDBMovie(item))
        .slice(0, 20);
      return res.json(results);
    } catch (err) {
      console.error("TMDB Search Fetch Error, fallback to mock search:", err);
    }
  }

  // Fallback mock search (case insensitive matching on title, genres, and overview)
  const term = query.toLowerCase();
  const matched = MOCK_MOVIES.filter(m => {
    return m.title.toLowerCase().includes(term) ||
           m.overview.toLowerCase().includes(term) ||
           m.genres.some(g => g.toLowerCase().includes(term));
  });
  res.json(matched);
});

// Single Movie Detail (supports full Cast and Video trailer metadata)
app.get('/api/movies/:id', async (req, res) => {
  const idStr = req.params.id;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID format" });
  }

  // 1. Check if mock movie matches
  const mockMovie = MOCK_MOVIES.find(m => m.id === id);

  if (IS_TMDB_ACTIVE) {
    try {
      // First try to fetch as a Movie
      let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
      let isTv = false;
      
      if (!response.ok) {
        // If it fails, fallback to fetching as a TV show
        response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
        isTv = true;
      }
      
      if (response.ok) {
        const data = await response.json();
        const parsed = isTv ? mapTMDBTVShow(data) : mapTMDBMovie(data);
        
        parsed.runtime = isTv 
          ? ((data.episode_run_time && data.episode_run_time[0]) || mockMovie?.runtime || 45)
          : (data.runtime || mockMovie?.runtime || 116);
        
        parsed.rating = isTv
          ? "TV-14"
          : (data.adult ? "NC-17" : (mockMovie?.rating || "PG-13"));
        
        // Extract YouTube trailer key
        if (data.videos && data.videos.results) {
          const trailer = data.videos.results.find((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
          if (trailer) {
            parsed.trailer_url = `https://www.youtube.com/embed/${trailer.key}`;
          }
        }
        if (!parsed.trailer_url && mockMovie) {
          parsed.trailer_url = mockMovie.trailer_url;
        }

        // Extract Top Cast
        if (data.credits && data.credits.cast) {
          parsed.cast = data.credits.cast.slice(0, 5).map((c: any) => ({
            name: c.name,
            character: c.character,
            profile_path: c.profile_path 
              ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          }));
        }
        
        return res.json(parsed);
      }
    } catch (err) {
      console.error(`TMDB Detail Fetch Error for ID ${id}, search in mocks:`, err);
    }
  }

  if (mockMovie) {
    return res.json(mockMovie);
  }

  // 3. Fallback: If ID is not a direct match and we don't have TMDB active, output a dynamically generated placeholder movie based on seed
  const platforms = Object.values(STREAMING_PLATFORMS);
  const fallbackMovie: Movie = {
    id,
    title: `Cinematic Title #${id}`,
    overview: "An immersive, high-stakes cinematic journey exploring themes of courage, mystery, and destiny. Follow a stellar ensemble cast as they embark on an adventure packed with breathtaking visual spectacles, heartwarming relationship arcs, and twists that will keep you guessing until the final screen fades to black.",
    poster_path: `https://images.unsplash.com/photo-1485452499355-747360c41078?auto=format&fit=crop&w=600&q=80`,
    backdrop_path: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80`,
    release_date: "2024-05-15",
    vote_average: 8.4,
    vote_count: 310,
    genres: ["Drama", "Action", "Adventure"],
    runtime: 125,
    rating: "PG-13",
    category: "Action",
    trailer_url: "https://www.youtube.com/embed/Way9Dexny3w",
    cast: [
      { name: "John Doe", character: "Protagonist", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Jane Smith", character: "Mentor", profile_path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [platforms[id % platforms.length], platforms[(id + 1) % platforms.length]]
  };

  res.json(fallbackMovie);
});

// -------------------------------------------------------------
// SEO Header Injection & Page Router Routing
// -------------------------------------------------------------

// Function to fetch metadata dynamically for injection
async function getMovieMetadata(id: number): Promise<{ title: string; description: string; image: string; releaseDate: string; rating: string }> {
  // Try mock first
  const mock = MOCK_MOVIES.find(m => m.id === id);
  if (mock) {
    return {
      title: mock.title,
      description: mock.overview,
      image: mock.backdrop_path,
      releaseDate: mock.release_date,
      rating: mock.rating || "PG-13"
    };
  }

  // Try fetching TMDB if available
  if (IS_TMDB_ACTIVE) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
      if (response.ok) {
        const item = await response.json();
        return {
          title: item.title,
          description: item.overview || '',
          image: item.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` 
            : `https://images.unsplash.com/photo-1536440136628-849c177e76a1`,
          releaseDate: item.release_date || '2024-01-01',
          rating: item.adult ? "NC-17" : "PG-13"
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    title: "Cinematic Showcase",
    description: "Stream this popular movie on SunnyMovies - your unified streaming companion.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    releaseDate: "2024-01-01",
    rating: "PG-13"
  };
}

// Intercept specific client navigation requests for direct SEO Meta Tag Injection
async function serveSPAWithMeta(req: any, res: any, indexHtmlPath: string) {
  try {
    let html = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Default general labels
    let titleStr = "SunnyMovies — Dynamic Streaming & Aggregation Central";
    let descStr = "Watch movies and view where to stream them on Netflix, Disney+, Prime Video, Max, and Hulu. Discover top categories, and manage your custom cinema watchlist.";
    let imgStr = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
    let keywordsStr = "sunnymovies, sunny movies, watch movies free, movie streaming platforms, netflix movies, disney plus, prime series, watch aggregator, seo movies, cinematic";
    let ldJsonStr = '';

    // Check if path is requesting a specific movie
    const movieMatch = req.path.match(/\/movie\/(\d+)/);
    if (movieMatch) {
      const movieId = parseInt(movieMatch[1], 10);
      if (!isNaN(movieId)) {
        const meta = await getMovieMetadata(movieId);
        titleStr = `${meta.title} — Watch Online, Cast & Streaming Platforms | SunnyMovies`;
        descStr = `Stream ${meta.title} (${meta.releaseDate.substring(0, 4)}). Read synopsis, view casting credits, and discover stream locations including Netflix, Prime Video, Hulu, Disney+ & Max. Rated ${meta.rating}.`;
        imgStr = meta.image;
        keywordsStr = `${meta.title}, watch ${meta.title} online, film cast, movie, streamer, stream guide, rating ${meta.rating}, sunnymovies, netflix, disney, amazon prime`;
        
        // Structured Schema.org Article / Movie markup for Google rich snippets SEO
        ldJsonStr = `
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Movie",
          "name": "${meta.title}",
          "image": "${imgStr}",
          "description": "${descStr.replace(/"/g, '\\"')}",
          "datePublished": "${meta.releaseDate}",
          "author": {
            "@type": "Organization",
            "name": "SunnyMovies Entertainment"
          }
        }
        </script>`;
      }
    }

    // Compose custom robust metatags header block matching Next.js SEO best-practices
    const seoInjections = `
    <title>${titleStr}</title>
    <meta name="description" content="${descStr}" />
    <meta name="keywords" content="${keywordsStr}" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="SunnyMovies" />

    <!-- Open Graph / Facebook / LinkedIn SEO -->
    <meta property="og:type" content="video.movie" />
    <meta property="og:title" content="${titleStr}" />
    <meta property="og:description" content="${descStr}" />
    <meta property="og:image" content="${imgStr}" />
    <meta property="og:url" content="https://sunnymovies.com${req.path}" />
    <meta property="og:site_name" content="SunnyMovies" />

    <!-- Twitter Card SEO -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${titleStr}" />
    <meta name="twitter:description" content="${descStr}" />
    <meta name="twitter:image" content="${imgStr}" />

    <!-- Google Site Verification Mock placeholder, Canonical Tag, and Structured Snippets -->
    <link rel="canonical" href="https://sunnymovies.com${req.path}" />
    ${ldJsonStr}
    `;

    // Replace the default static title tag with the custom dynamic header blocks
    if (html.includes('<title>My Google AI Studio App</title>')) {
      html = html.replace('<title>My Google AI Studio App</title>', seoInjections);
    } else {
      // Find head closing tag and append before it
      html = html.replace('</head>', `${seoInjections}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (err) {
    console.error("SEO SPA Injection Failed, serving plain HTML file:", err);
    res.sendFile(indexHtmlPath);
  }
}

// -------------------------------------------------------------
// Vite Middleware / Static Assets serving
// -------------------------------------------------------------

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });

    // Mount Vite dev middlewares
    app.use(vite.middlewares);

    // Let index.html fallback intercept requests for SEO injection in Dev
    app.get('*', async (req, res) => {
      const indexDevPath = path.join(process.cwd(), 'index.html');
      await serveSPAWithMeta(req, res, indexDevPath);
    });

  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    const indexProdPath = path.join(distPath, 'index.html');

    // Serve static files (except index.html)
    app.use(express.static(distPath, { index: false }));

    // Dynamic SEO HTML route handler in production
    app.get('*', async (req, res) => {
      await serveSPAWithMeta(req, res, indexProdPath);
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[SunnyMovies Server] Up and running on http://${HOST}:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

bootstrap().catch((err) => {
  console.error("Critical Backend Bootstrap Error:", err);
});
