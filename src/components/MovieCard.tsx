/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '../types';

interface MovieCardProps {
  key?: any;
  movie: Movie;
  onClick: (id: number) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: number, e: any) => void;
}

export default function MovieCard({
  movie,
  onClick,
  isWatchlisted,
  onToggleWatchlist
}: MovieCardProps): any {
  
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    // Cap subtle tilting rotation at +/- 6 degrees max for high elegance
    const rX = ((y - centerY) / centerY) * -6;
    const rY = ((x - centerX) / centerX) * 6;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const ratingColorClass = (vote: number) => {
    if (vote >= 8.5) return 'text-amber-500';
    if (vote >= 7.5) return 'text-yellow-500';
    return 'text-zinc-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6, scale: 1.015 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative flex flex-col bg-white dark:bg-vibrant-card-dark border border-zinc-150 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_28px_rgba(255,184,0,0.14)] transition-shadow duration-300 cursor-pointer select-none"
      onClick={() => onClick(movie.id)}
    >
      
      {/* Poster Image Stage */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={movie.poster_path}
          alt={`Poster for ${movie.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30 opacity-60 group-hover:opacity-85 transition-opacity" />

        {/* Dynamic Badges Overlay (Vote Average) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md bg-zinc-950/75 border border-white/10 text-white text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-vibrant-amber text-vibrant-amber" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Quick Add To Watchlist Button */}
        <button
          onClick={(e) => onToggleWatchlist(movie.id, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md border shadow-sm transition-all active:scale-90 ${
            isWatchlisted
              ? 'bg-vibrant-amber hover:opacity-90 text-zinc-950 border-transparent shadow-[0_0_10px_rgba(255,184,0,0.4)]'
              : 'bg-zinc-950/75 hover:bg-zinc-950/90 text-white border-white/10'
          }`}
          title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
          aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isWatchlisted ? (
            <BookmarkCheck className="w-3.5 h-3.5" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Quick Play Arrow on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-vibrant-amber text-zinc-950 flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300 font-bold">
            <Play className="w-5 h-5 fill-zinc-950 ml-0.5" />
          </div>
        </div>

        {/* Direct Tags indicating popular streaming sites */}
        {movie.streaming_platforms && movie.streaming_platforms.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1">
            {movie.streaming_platforms.map((platform) => (
              <span
                key={platform.name}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm border border-white/5 shadow-xs transition-colors pointer-events-none ${platform.badgeColor}`}
              >
                {platform.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Text Card Base */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-vibrant-amber">
              {movie.category || movie.genres[0]}
            </span>
            <span className="text-3xs text-zinc-450 font-medium">
              {(movie.release_date || '').substring(0, 4)}
            </span>
          </div>

          <h3 className="font-display font-bold text-sm text-zinc-850 dark:text-zinc-100 line-clamp-1 group-hover:text-vibrant-amber dark:group-hover:text-vibrant-amber transition-colors">
            {movie.title}
          </h3>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed font-light">
          {movie.overview}
        </p>
      </div>

    </motion.div>
  );
}
