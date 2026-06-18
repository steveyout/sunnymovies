/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';

interface HeroSliderProps {
  movies: Movie[];
  onMovieClick: (id: number) => void;
  watchlist: number[];
  onToggleWatchlist: (id: number, e: any) => void;
  onPlayTrailer: (movie: Movie) => void;
}

export default function HeroSlider({
  movies,
  onMovieClick,
  watchlist,
  onToggleWatchlist,
  onPlayTrailer
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval for cycling through billboard backdrops
  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const isWatchlisted = watchlist.includes(currentMovie.id);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] rounded-3xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-950 text-white select-none">
      
      {/* Background Backdrops with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentMovie.backdrop_path}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-top filter brightness-[0.42] dark:brightness-[0.38] md:object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Top Banner Gradient Shadow overlay (Cinema style) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-[#0A0A0B]/10 to-transparent md:from-[#0A0A0B]/95" />
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-vibrant-amber/5 to-transparent opacity-25 pointer-events-none" />

      {/* Slide Content Layout */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-4xl">
        <motion.div
          key={`cont-${currentMovie.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Badge Rows */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-vibrant-amber text-zinc-950 rounded-lg shadow-[0_0_15px_rgba(255,184,0,0.35)] leading-none select-none">
              Featured Trending
            </span>
            {currentMovie.genres.slice(0, 3).map((g) => (
              <span key={g} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/5 text-zinc-200">
                {g}
              </span>
            ))}
            <div className="flex items-center gap-1.5 ml-2">
              <Star className="w-3.5 h-3.5 fill-vibrant-amber text-vibrant-amber animate-pulse" />
              <span className="text-xs font-extrabold text-vibrant-amber">{currentMovie.vote_average.toFixed(1)} Rating</span>
            </div>
          </div>

          {/* Heading Title */}
          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none text-white drop-shadow-sm line-clamp-2 uppercase italic">
            {currentMovie.title}
          </h1>

          {/* Overview text */}
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-4">
            {currentMovie.overview}
          </p>

          {/* Hot Streaming Badges Area */}
          {currentMovie.streaming_platforms && currentMovie.streaming_platforms.length > 0 && (
            <div className="flex items-center gap-2 py-1.5 border-t border-white/5 w-fit">
              <span className="text-3xs uppercase tracking-wider text-zinc-400 font-bold">Stream Now On:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentMovie.streaming_platforms.map((p) => (
                  <span key={p.name} className={`text-3xs font-extrabold px-2 py-0.5 rounded-md ${p.badgeColor}`}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            
            {/* Play Button */}
            <button
              onClick={() => onPlayTrailer(currentMovie)}
              className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-vibrant-amber hover:opacity-95 text-zinc-950 font-black text-xs sm:text-xs tracking-wider uppercase hover:scale-105 active:scale-98 transition-transform shadow-[0_0_20px_rgba(255,184,0,0.4)]"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Watch</span>
            </button>

            {/* Read details button */}
            <button
              onClick={() => onMovieClick(currentMovie.id)}
              className="flex items-center gap-2 px-4.5 py-2.5 sm:px-5.5 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white font-bold text-xs sm:text-sm active:scale-98 transition"
            >
              <Info className="w-4 h-4" />
              <span>Explore Info</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={(e) => onToggleWatchlist(currentMovie.id, e)}
              className={`p-2.5 sm:p-3.5 rounded-xl border transition active:scale-95 ${
                isWatchlisted
                  ? 'bg-vibrant-amber/20 text-vibrant-amber border-vibrant-amber/40 hover:bg-vibrant-amber/30'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
              title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
              aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

          </div>
        </motion.div>
      </div>

      {/* Billboard Sliders Arrows Controls */}
      {movies.length > 1 && (
        <div className="absolute right-4 bottom-4 flex items-center gap-2.5 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-[#121214]/80 hover:bg-[#1E1E21] border border-white/5 flex items-center justify-center text-white transition active:scale-90 shadow-[0_0_10px_rgba(255,184,0,0.1)] bg-transparent"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Index Counter Indicator */}
          <span className="text-3xs font-mono font-bold tracking-widest text-zinc-300 bg-[#121214]/85 px-2.5 py-1.5 rounded-lg border border-white/5">
            {String(currentIndex + 1).padStart(2, '0')} / {String(movies.length).padStart(2, '0')}
          </span>

          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-[#121214]/80 hover:bg-[#1E1E21] border border-white/5 flex items-center justify-center text-white transition active:scale-90 shadow-[0_0_10px_rgba(255,184,0,0.1)] bg-transparent"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
