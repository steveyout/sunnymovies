/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bookmark, Search, User, Play, Star, SlidersHorizontal, Trash2, Heart, Film, ArrowRight, ShieldCheck, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Movie, UserProfile, ViewType } from './types';
import { MOCK_MOVIES } from '../server_mock_data';
import Navigation from './components/Navigation';
import MovieCard from './components/MovieCard';
import MovieCardSkeleton from './components/MovieCardSkeleton';
import HeroSlider from './components/HeroSlider';
import MovieDetails from './components/MovieDetails';
import TrailerModal from './components/TrailerModal';
import SEO from './components/SEO';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

export default function App() {
  // --- Central States ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sunny_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Cool dark-mode priority as cinematic default
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('sunny_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Movie repositories
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Watchlist & Profile persistence
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('sunny_watchlist');
    return saved ? JSON.parse(saved) : [101, 102, 105]; // Prefilled cool starting items
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sunny_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: "Sunny Streamer",
      email: "streamer@sunnymovies.com",
      avatar: DEFAULT_AVATAR,
      preferred_genres: ["Sci-Fi", "Action", "Drama"],
      watchlist: [101, 102, 105],
      watch_history: [
        { movie_id: 103, watched_at: "2026-06-15", progress: 100 },
        { movie_id: 104, watched_at: "2026-06-17", progress: 65 }
      ]
    };
  });

  // Loading & interactive modal states
  const [loading, setLoading] = useState(false);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);
  const [selectedStreamingFilter, setSelectedStreamingFilter] = useState<string>('All');
  const [apiHealth, setApiHealth] = useState({ tmdb_configured: false, popular_platforms_count: 5 });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Navigation & loading top progress bar
  const [navProgress, setNavProgress] = useState(0);
  const [isNavLoading, setIsNavLoading] = useState(false);

  // --- Effects ---

  // Handle Theme switching class toggling
  useEffect(() => {
    localStorage.setItem('sunny_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Top progress loader for screen navigation and loading states
  useEffect(() => {
    setIsNavLoading(true);
    setNavProgress(15);
    
    const termTimer = setTimeout(() => {
      setNavProgress(45);
    }, 60);
    
    const termTimer2 = setTimeout(() => {
      setNavProgress(80);
    }, 150);

    const termTimer3 = setTimeout(() => {
      setNavProgress(100);
      setTimeout(() => {
        setIsNavLoading(false);
      }, 120);
    }, 320);

    return () => {
      clearTimeout(termTimer);
      clearTimeout(termTimer2);
      clearTimeout(termTimer3);
    };
  }, [currentView, loading]);

  // Sync Watchlist and Profile array states
  useEffect(() => {
    localStorage.setItem('sunny_watchlist', JSON.stringify(watchlist));
    setProfile(prev => ({
      ...prev,
      watchlist: watchlist
    }));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('sunny_profile', JSON.stringify(profile));
  }, [profile]);

  // Read backend capabilities on load
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setApiHealth({
          tmdb_configured: data.tmdb_configured,
          popular_platforms_count: data.popular_platforms_count
        });
      })
      .catch(err => console.error("API check failed:", err));
  }, []);

  // Primary Movies fetch engine (Trending & Popular)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/movies/trending').then(res => res.json()),
      fetch('/api/movies/popular').then(res => res.json())
    ])
      .then(([trendingRes, popularRes]) => {
        setTrendingMovies(trendingRes);
        setPopularMovies(popularRes);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch trending/popular failed:", err);
        setLoading(false);
      });
  }, [apiHealth.tmdb_configured]);

  // Category change effects (fetch corresponding category endpoint)
  useEffect(() => {
    if (activeCategory === 'All') {
      setCategoryMovies([]);
      return;
    }
    setLoading(true);
    fetch(`/api/movies/category/${encodeURIComponent(activeCategory.toLowerCase())}`)
      .then(res => res.json())
      .then(data => {
        setCategoryMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Category ${activeCategory} fetch failed:`, err);
        setLoading(false);
      });
  }, [activeCategory, apiHealth.tmdb_configured]);

  // Live query-based search engine (with simple debounce)
  useEffect(() => {
    const term = searchQuery.trim();
    if (!term) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetch(`/api/movies/search?q=${encodeURIComponent(term)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setLoading(false);
          
          // Save successful query to recent searches
          setRecentSearches(prev => {
            const trimmed = term.toLowerCase();
            const filtered = prev.filter(item => item.toLowerCase() !== trimmed);
            const sliced = [term, ...filtered].slice(0, 6);
            localStorage.setItem('sunny_recent_searches', JSON.stringify(sliced));
            return sliced;
          });
        })
        .catch(err => {
          console.error("Search fetch failed:", err);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, apiHealth.tmdb_configured]);

  // --- Handlers ---

  const handleToggleWatchlist = (id: number, e?: any) => {
    if (e) e.stopPropagation();
    setWatchlist(prev => {
      if (prev.includes(id)) {
        return prev.filter(mid => mid !== id);
      } else {
        // Add to list and pop watching history log
        return [...prev, id];
      }
    });

    // Add record to watch history to expand analytics metrics
    if (!watchlist.includes(id)) {
      setProfile(prev => {
        const alreadyExists = prev.watch_history.some(h => h.movie_id === id);
        if (alreadyExists) return prev;
        return {
          ...prev,
          watch_history: [
            { movie_id: id, watched_at: new Date().toISOString().split('T')[0], progress: 100 },
            ...prev.watch_history
          ]
        };
      });
    }
  };

  const handleMovieNavigate = (id: number) => {
    setSelectedMovieId(id);
    setCurrentView('movie');
    // Ensure window scrolls up smoothly to top of cinematic details
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleReturnToExplore = () => {
    setSelectedMovieId(null);
    setCurrentView('home');
  };

  const handleClearRecentSearch = (term: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== term);
      localStorage.setItem('sunny_recent_searches', JSON.stringify(filtered));
      return filtered;
    });
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('sunny_recent_searches');
  };

  const handleProfileFieldChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecordWatchHistory = (movieId: number, progress: number) => {
    setProfile(prev => {
      const existsIdx = (prev.watch_history || []).findIndex(h => h.movie_id === movieId);
      let updatedHistory = [...(prev.watch_history || [])];

      if (existsIdx > -1) {
        updatedHistory[existsIdx] = {
          ...updatedHistory[existsIdx],
          watched_at: new Date().toISOString().split('T')[0],
          progress: Math.max(updatedHistory[existsIdx].progress, progress)
        };
      } else {
        updatedHistory = [
          {
            movie_id: movieId,
            watched_at: new Date().toISOString().split('T')[0],
            progress: progress
          },
          ...updatedHistory
        ];
      }

      return {
        ...prev,
        watch_history: updatedHistory
      };
    });
  };

  // --- Helpers for details retrieval ---
  const getSelectedMovieRecord = (): Movie | null => {
    if (!selectedMovieId) return null;
    const allKnown = [...trendingMovies, ...popularMovies, ...categoryMovies, ...searchResults];
    const match = allKnown.find(m => m.id === selectedMovieId);
    if (match) return match;
    
    // Look in mock data
    const mockMatch = MOCK_MOVIES.find(m => m.id === selectedMovieId);
    return mockMatch || null;
  };

  const getWatchlistMovies = (): Movie[] => {
    // Collect watchlist entities
    const results: Movie[] = [];
    const allKnown = [...trendingMovies, ...popularMovies, ...categoryMovies, ...searchResults, ...MOCK_MOVIES];
    watchlist.forEach(id => {
      const match = allKnown.find(m => m.id === id);
      if (match && !results.some(r => r.id === id)) {
        results.push(match);
      }
    });
    return results;
  };

  const getContinueWatchingMovies = (): { movie: Movie; progress: number }[] => {
    const historical = profile.watch_history || [];
    const allKnown = [...trendingMovies, ...popularMovies, ...categoryMovies, ...searchResults, ...MOCK_MOVIES];
    
    // De-duplicate historical by movie_id to ensure we only show the newest attempt per movie
    const uniqueHistory: typeof historical = [];
    historical.forEach(item => {
      if (!uniqueHistory.some(h => h.movie_id === item.movie_id)) {
        uniqueHistory.push(item);
      }
    });

    return uniqueHistory
      .map(entry => {
        const found = allKnown.find(m => m.id === entry.movie_id);
        if (found) {
          return { movie: found, progress: entry.progress };
        }
        return null;
      })
      .filter((item): item is { movie: Movie; progress: number } => item !== null)
      .slice(0, 4); // Limit to top 4 recently watched films
  };

  const currentMovieRecord = getSelectedMovieRecord();
  const continueWatchingItems = getContinueWatchingMovies();

  return (
    <div className="min-h-screen pb-20 md:pb-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300 flex flex-col font-sans select-none">
      
      {/* Top Ambient Navigation/Query Progress Bar */}
      {isNavLoading && (
        <div className="fixed top-0 left-0 right-0 h-[3.5px] bg-vibrant-amber/10 z-[9999] pointer-events-none">
          <div 
            className="h-full bg-gradient-to-r from-[#FFB800] to-amber-400 shadow-[0_0_12px_rgba(255,184,0,0.65)] transition-all duration-300 ease-out"
            style={{ width: `${navProgress}%` }}
          />
        </div>
      )}
      
      {/* 1. Dynamic Client-Side title sync for SEO indexing */}
      <SEO 
        title={
          currentView === 'movie' && currentMovieRecord 
            ? `${currentMovieRecord.title} (${currentMovieRecord.release_date.substring(0, 4)})`
            : `${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`
        }
        description={
          currentView === 'movie' && currentMovieRecord
            ? currentMovieRecord.overview
            : undefined
        }
      />

      {/* 2. Top Banner Alert when running fallback mode (transparent notice) */}
      {!apiHealth.tmdb_configured && (
        <div className="bg-vibrant-amber/10 dark:bg-vibrant-amber/5 text-vibrant-amber text-[10px] md:text-xs text-center py-2 px-4 font-mono font-medium tracking-tight flex items-center justify-center gap-1.5 leading-none select-none border-b border-white/5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Demo Sandbox optimization: Using high-fidelity content backdrops. For TMDB Database, inject <b>TMDB_API_KEY</b> in Settings.</span>
        </div>
      )}

      {/* 3. Sleek Responsive Sidebar / Top and Bottom Header Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedMovieId(null);
        }}
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        watchlistCount={watchlist.length}
        avatar={profile.avatar}
      />

      {/* 4. Core Layout View Transition Area */}
      <main className="flex-1 w-full relative pt-4 md:pt-6 font-sans">
        <AnimatePresence mode="wait">
          
          {/* ================= HOME VIEW ================= */}
          {currentView === 'home' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6"
            >
              {/* Slider for Trending Showcase Banner */}
              {trendingMovies.length > 0 && (
                <HeroSlider
                  movies={trendingMovies}
                  onMovieClick={handleMovieNavigate}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
                />
              )}

              {/* SPOTLIGHT STREAM PLATFORMS ROW - "Include tags of popular streaming sites" */}
              <section className="py-2 inline-flex items-center gap-4 w-full overflow-x-auto no-scrollbar border-y border-zinc-150 dark:border-white/5 scroll-smooth">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap pl-2">
                  Direct Stream Spotlights:
                </span>
                
                <div className="flex gap-1.5">
                  <a href="https://netflix.com" target="_blank" rel="noreferrer" className="text-3xs font-extrabold px-3 py-1.5 rounded-xl bg-red-600 text-white flex items-center gap-1.5 hover:scale-102 transition">
                    <span>Netflix</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://disneyplus.com" target="_blank" rel="noreferrer" className="text-3xs font-extrabold px-3 py-1.5 rounded-xl bg-blue-900 text-sky-200 flex items-center gap-1.5 hover:scale-102 transition">
                    <span>Disney+</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://primevideo.com" target="_blank" rel="noreferrer" className="text-3xs font-extrabold px-3 py-1.5 rounded-xl bg-sky-500 text-slate-900 flex items-center gap-1.5 hover:scale-102 transition">
                    <span>Prime Video</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://max.com" target="_blank" rel="noreferrer" className="text-3xs font-extrabold px-3 py-1.5 rounded-xl bg-indigo-700 text-white flex items-center gap-1.5 hover:scale-102 transition">
                    <span>HBO Max</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://hulu.com" target="_blank" rel="noreferrer" className="text-3xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 flex items-center gap-1.5 hover:scale-102 transition">
                    <span>Hulu</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </section>

              {/* CONTINUE WATCHING SECTION */}
              {continueWatchingItems.length > 0 && (
                <section className="space-y-4 animate-enter">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-4 bg-vibrant-amber rounded-full animate-pulse"></span>
                    <h2 className="font-display font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-zinc-50 uppercase italic">
                      Resume Playback
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {continueWatchingItems.map(({ movie, progress }) => (
                      <div 
                        key={`watching-${movie.id}`}
                        className="group relative bg-white dark:bg-vibrant-card-dark border border-zinc-150 dark:border-white/5 rounded-2xl overflow-hidden p-3.5 shadow-xs hover:shadow-[0_0_15px_rgba(255,184,0,0.15)] transition-all flex flex-col justify-between cursor-pointer"
                        onClick={() => handleMovieNavigate(movie.id)}
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail / Poster path */}
                          <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 flex-shrink-0">
                            <img 
                              src={movie.poster_path} 
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {/* Overlay play bar */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-5 h-5 text-vibrant-amber fill-vibrant-amber" />
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="text-[9px] font-extrabold uppercase text-vibrant-amber tracking-wider truncate mb-0.5">
                              {movie.genres.slice(0, 2).join(' / ')}
                            </span>
                            <h3 className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-100 line-clamp-1 group-hover:text-[#FFB800] transition-colors">
                              {movie.title}
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-light mt-1">
                              Recently active stream
                            </span>
                          </div>
                        </div>

                        {/* Bottom progress bar */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono font-medium text-zinc-400">
                            <span>Buffered: {progress}%</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTrailerMovie(movie);
                              }}
                              className="text-vibrant-amber flex items-center gap-1 font-bold hover:underline bg-transparent"
                            >
                              <span>Resume</span>
                              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                          
                          <div className="w-full bg-zinc-150 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-vibrant-amber h-full rounded-full shadow-[0_0_8px_rgba(255,184,0,0.5)]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Grid Section for Movies with dynamic category selection */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                      Explore Sunny Library
                    </h2>
                    <p className="text-3xs sm:text-xs text-zinc-400 font-light mt-0.5">
                      Select film genres instantly to sort matching releases below
                    </p>
                  </div>

                  {/* Horizontal Category pills menu */}
                  <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar animate-enter">
                    {['All', 'Sci-Fi', 'Action', 'Comedy', 'Drama', 'Romance'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-3xs sm:text-2xs font-extrabold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 bg-transparent ${
                          activeCategory === cat
                            ? 'bg-vibrant-amber text-zinc-950 shadow-md font-black shadow-[0_0_15px_rgba(255,184,0,0.35)]'
                            : 'bg-zinc-150/70 dark:bg-vibrant-panel-dark text-zinc-650 dark:text-zinc-350 hover:bg-zinc-200 dark:hover:opacity-90'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skeleton Loading Grid */}
                {loading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4.5 sm:gap-6">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <MovieCardSkeleton key={`skeleton-home-${idx}`} />
                    ))}
                  </div>
                )}

                {/* Movie list rendering */}
                {!loading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4.5 sm:gap-6">
                    {activeCategory === 'All' ? (
                      popularMovies.map((movie) => (
                        <MovieCard
                          key={`pop-${movie.id}`}
                          movie={movie}
                          onClick={handleMovieNavigate}
                          isWatchlisted={watchlist.includes(movie.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))
                    ) : categoryMovies.length > 0 ? (
                      categoryMovies.map((movie) => (
                        <MovieCard
                          key={`cat-${movie.id}`}
                          movie={movie}
                          onClick={handleMovieNavigate}
                          isWatchlisted={watchlist.includes(movie.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center text-zinc-500 dark:text-zinc-400 space-y-2.5">
                        <Film className="w-8 h-8 mx-auto text-zinc-300 animate-pulse" />
                        <p className="text-xs">No entries cataloged currently under {activeCategory}.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================= MOVIE DETAILS VIEW ================= */}
          {currentView === 'movie' && currentMovieRecord && (
            <MovieDetails
              movie={currentMovieRecord}
              onBack={handleReturnToExplore}
              isWatchlisted={watchlist.includes(currentMovieRecord.id)}
              onToggleWatchlist={(id) => handleToggleWatchlist(id)}
              onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
              similarMovies={popularMovies.filter(m => m.id !== currentMovieRecord.id).slice(0, 3)}
              onMovieClick={handleMovieNavigate}
            />
          )}

          {/* ================= EXPLORE & SEARCH VIEW ================= */}
          {currentView === 'search' && (
            <motion.div
              key="view-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div>
                <h1 className="font-display font-extrabold text-xl sm:text-3xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  Explore Infinite Realms
                </h1>
                <p className="text-3xs sm:text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                  Query global blockbusting catalogs, or filter by popular streaming platform tags
                </p>
              </div>

              {/* Combined Search bar controls */}
              <div className="p-4 sm:p-5 rounded-3xl bg-zinc-50 dark:bg-[#1E1E21] border border-zinc-200/60 dark:border-white/5 space-y-4 shadow-sm">
                
                {/* Search input field */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search movie title, synopsis keywords, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10.5 pr-4 py-3 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-xl text-neutral-800 dark:text-neutral-100 outline-none focus:border-vibrant-amber transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-2xs text-zinc-450 hover:text-zinc-650 transition bg-transparent"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                    <span className="text-[10px] font-extrabold uppercase text-neutral-500 flex items-center gap-1 whitespace-nowrap pt-1">
                      <History className="w-3.5 h-3.5" />
                      <span>Recent Searches:</span>
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {recentSearches.map((term, index) => (
                        <div 
                          key={`recent-${index}-${term}`}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-3xs font-extrabold px-2.5 py-1 rounded-lg border border-zinc-200/50 dark:border-white/5 bg-zinc-100/50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300 hover:border-vibrant-amber/40 hover:text-vibrant-amber hover:bg-vibrant-amber/5 transition cursor-pointer group"
                        >
                          <span 
                            onClick={() => setSearchQuery(term)}
                            className="truncate max-w-[120px]"
                          >
                            {term}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearRecentSearch(term);
                            }}
                            className="hover:text-red-500 rounded p-0.5 transition bg-transparent"
                            title="Remove from history"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={handleClearAllRecentSearches}
                        className="text-[9px] uppercase font-bold text-zinc-400 hover:text-red-400 py-1 px-2.5 rounded-lg hover:bg-red-500/10 transition bg-transparent"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                {/* Popular Streaming platform fast filters - "Include tags of popular streaming sites" */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-500 flex items-center gap-1 whitespace-nowrap pt-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filter Stream Tags:</span>
                  </span>

                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                    {['All', 'Netflix', 'Disney+', 'Prime Video', 'Max', 'Hulu'].map((plat) => (
                      <button
                        key={plat}
                        onClick={() => setSelectedStreamingFilter(plat)}
                        className={`text-3xs font-extrabold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap bg-transparent ${
                          selectedStreamingFilter === plat
                            ? 'bg-vibrant-amber text-zinc-950 font-black shadow-[0_0_10px_rgba(255,184,0,0.3)]'
                            : 'bg-zinc-150/60 dark:bg-[#121214] text-zinc-600 dark:text-zinc-350 hover:bg-zinc-200 dark:hover:opacity-90'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Dynamic list rendering */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-100/40 dark:bg-zinc-900/10 px-4 py-2 rounded-xl">
                  <span className="text-3xs font-mono font-bold tracking-wider text-zinc-450 uppercase">
                    {searchQuery ? `Query Hits: ${searchResults.length}` : 'Suggested Cinema releases'}
                  </span>
                  
                  {selectedStreamingFilter !== 'All' && (
                    <span className="text-3xs font-bold text-amber-500 uppercase">
                      Streaming on {selectedStreamingFilter}
                    </span>
                  )}
                </div>

                {/* Skeleton Loading Grid */}
                {loading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <MovieCardSkeleton key={`skeleton-search-${idx}`} />
                    ))}
                  </div>
                )}

                {!loading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Combine lists and apply filter */}
                    {(() => {
                      const baseList = searchQuery ? searchResults : [...trendingMovies, ...popularMovies];
                      // Deduplicate movies by ID
                      const uniqueList = baseList.filter((m, i, self) => self.findIndex(t => t.id === m.id) === i);
                      
                      // Filter by streaming tag if selected
                      const filtered = selectedStreamingFilter === 'All' 
                        ? uniqueList
                        : uniqueList.filter(m => m.streaming_platforms?.some(p => p.name === selectedStreamingFilter));

                      if (filtered.length === 0) {
                        return (
                          <div className="col-span-full py-16 text-center text-zinc-500 space-y-2">
                            <Bookmark className="w-8 h-8 mx-auto text-zinc-300" />
                            <p className="text-xs">No movies correspond to the chosen filter keywords.</p>
                          </div>
                        );
                      }

                      return filtered.map((movie) => (
                        <MovieCard
                          key={`search-${movie.id}`}
                          movie={movie}
                          onClick={handleMovieNavigate}
                          isWatchlisted={watchlist.includes(movie.id)}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ));
                    })()}
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* ================= WATCHLIST VIEW ================= */}
          {currentView === 'watchlist' && (
            <motion.div
              key="view-watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display font-extrabold text-xl sm:text-3xl tracking-tight text-zinc-900 dark:text-zinc-50">
                    My Sunny Watchlist
                  </h1>
                  <p className="text-3xs sm:text-xs text-zinc-530 dark:text-neutral-400 font-light mt-0.5">
                    Saved releases, synced and stored dynamically on this device
                  </p>
                </div>

                {watchlist.length > 0 && (
                  <div className="flex items-center gap-2">
                    {showClearConfirm ? (
                      <div className="flex items-center gap-1.5 animate-enter">
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Clear watchlist?</span>
                        <button
                          onClick={() => {
                            setWatchlist([]);
                            setShowClearConfirm(false);
                          }}
                          className="px-2.5 py-1 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg text-3xs font-extrabold transition cursor-pointer"
                        >
                          Yes, Clear
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="px-2.5 py-1 text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg text-3xs font-extrabold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowClearConfirm(true);
                        }}
                        className="flex items-center gap-1 text-zinc-450 hover:text-red-500 text-3xs font-bold transition px-2.5 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800 bg-transparent cursor-pointer"
                        aria-label="Empty watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Grid content */}
              {watchlist.length === 0 ? (
                <div className="py-24 max-w-md mx-auto text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 flex items-center justify-center mx-auto shadow-md glow-sunny animate-bounce">
                    <Bookmark className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-zinc-800 dark:text-zinc-200">Watchlist is empty</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light max-w-xs mx-auto leading-relaxed">
                      Add films of popular streaming sites from our home explore section to start building your unified collection.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold shadow-sm active:scale-95 transition"
                  >
                    Discover Popular Releases
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {getWatchlistMovies().map((movie) => (
                    <MovieCard
                      key={`watchlist-${movie.id}`}
                      movie={movie}
                      onClick={handleMovieNavigate}
                      isWatchlisted={watchlist.includes(movie.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ================= USER PROFILE VIEW ================= */}
          {currentView === 'profile' && (
            <motion.div
              key="view-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-4xl mx-auto px-4 "
            >
              <div>
                <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  User Cinema Profile
                </h1>
                <p className="text-3xs sm:text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                  Configure streaming choices and track global viewing analytics metrics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Profile Editor Card */}
                <div className="md:col-span-5 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 shadow-sm space-y-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative group cursor-pointer leading-none">
                      <img
                        src={profile.avatar}
                        alt="Profile avatar"
                        className="w-20 h-20 rounded-full border-4 border-amber-500/80 object-cover shadow-md group-hover:scale-102 transition"
                        referrerPolicy="no-referrer"
                      />
                      
                      <button
                        onClick={() => {
                          const customUrl = prompt("Enter custom Avatar Image URL:", profile.avatar);
                          if (customUrl && customUrl.trim()) {
                            handleProfileFieldChange('avatar', customUrl.trim());
                          }
                        }}
                        className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-bold text-white py-0.5 rounded-b-full text-center hover:bg-black/80 transition"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <h2 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-200">
                        {profile.name}
                      </h2>
                      <span className="text-3xs text-neutral-450 font-medium font-mono">{profile.email}</span>
                    </div>
                  </div>

                  <hr className="border-zinc-200/50 dark:border-zinc-800" />

                  {/* Settings fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-zinc-450 tracking-wider mb-1">Display Username</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 outline-none text-neutral-800 dark:text-neutral-100 focus:border-amber-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-zinc-450 tracking-wider mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 outline-none text-neutral-800 dark:text-neutral-100 focus:border-amber-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Statistics & Preference cards */}
                <div className="md:col-span-7 space-y-6">
                  
                  {/* Real-time statistics tracker */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 shadow-3xs text-center space-y-1">
                      <Bookmark className="w-5 h-5 mx-auto text-amber-500" />
                      <span className="block text-lg font-extrabold tracking-tight font-mono">{watchlist.length}</span>
                      <span className="block text-[10px] text-zinc-450 uppercase tracking-tight">Watchlist</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 shadow-3xs text-center space-y-1">
                      <Star className="w-5 h-5 mx-auto text-yellow-500" />
                      <span className="block text-lg font-extrabold tracking-tight font-mono">
                        {profile.watch_history.length}
                      </span>
                      <span className="block text-[10px] text-zinc-450 uppercase tracking-tight">Watched</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 shadow-3xs text-center space-y-1">
                      <Heart className="w-5 h-5 mx-auto text-red-500" />
                      <span className="block text-lg font-extrabold tracking-tight font-mono">{profile.preferred_genres.length}</span>
                      <span className="block text-[10px] text-zinc-450 uppercase tracking-tight">Genres</span>
                    </div>
                  </div>

                  {/* Profile choice lists */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 space-y-4 shadow-3xs">
                    <h3 className="font-display font-extrabold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                      My Preferred Streaming Partners
                    </h3>
                    
                    <p className="text-3xs text-neutral-450 font-light leading-relaxed">
                      Toggle streaming channels you actively pay for to tailor aggregation matches across exploration sections:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Netflix', 'Disney+', 'Prime Video', 'Max', 'Hulu'].map((plat) => {
                        const isPref = profile.preferred_genres.includes(plat);
                        return (
                          <button
                            key={plat}
                            onClick={() => {
                              if (isPref) {
                                handleProfileFieldChange('preferred_genres', profile.preferred_genres.filter(g => g !== plat));
                              } else {
                                handleProfileFieldChange('preferred_genres', [...profile.preferred_genres, plat]);
                              }
                            }}
                            className={`text-3xs font-extrabold px-3 py-2 rounded-xl transition-all active:scale-95 border ${
                              isPref
                                ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                                : 'bg-transparent text-neutral-500 hover:text-neutral-700 border-zinc-200 dark:border-zinc-800'
                            }`}
                          >
                            <span>{plat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme Quick Card */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-250 dark:border-zinc-850 flex items-center justify-between shadow-3xs">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 font-display">Nighttime Theater Viewing</h4>
                      <p className="text-3xs text-zinc-450 font-light mt-0.5">Toggle screen intensity to protect your vision</p>
                    </div>

                    <button
                      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                      className="px-4 py-2 text-2xs font-extrabold uppercase tracking-wide rounded-xl border border-zinc-350 dark:border-zinc-850 bg-white dark:bg-zinc-950 transition-all text-amber-550 dark:text-yellow-400 font-bold active:scale-95"
                    >
                      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 6. Modern, Cinematic Footer Section */}
      <footer className="mt-auto bg-zinc-100 dark:bg-[#0A0A0B] border-t border-zinc-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            
            {/* Left section: Brand name and high speed indexing disclaimer */}
            <div className="space-y-3.5 max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-vibrant-amber rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,184,0,0.5)]">
                  <div className="w-4 h-4 border-2 border-white dark:border-zinc-950 rounded-full" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-zinc-900 dark:text-zinc-50">
                  Sunny<span className="text-vibrant-amber">Movies</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                SunnyMovies aggregates open API stream nodes and popular online streaming networks into a clean, 3D animated user interface. Explore trailers and watch high-integrity content directly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-650 dark:text-zinc-400">
                React 19
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CDN ONLINE
              </span>
            </div>

          </div>

          <hr className="border-zinc-200 dark:border-white/5 my-5" />

          {/* Sub-footer metadata bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-3xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
            <span>© 2026 SUNNYMOVIES. ALL STREAMS INDEXED VIA SANDBOX SECURE DOMAINS.</span>
            <span>Buffered Streams Live: 100% stable</span>
          </div>
        </div>
      </footer>

      {/* 5. Central Display Modal for Trailer iframe embeds */}
      <AnimatePresence>
        {activeTrailerMovie && (
          <TrailerModal
            movie={activeTrailerMovie}
            onClose={() => setActiveTrailerMovie(null)}
            onRecordWatchHistory={handleRecordWatchHistory}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
