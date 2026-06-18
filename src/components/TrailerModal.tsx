/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Tv, Play, HardDrive, Info, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';
import { providers, DEFAULT_PROVIDER_ID, getEmbedUrl } from '../config/providers';

interface TrailerModalProps {
  movie: Movie;
  onClose: () => void;
  onRecordWatchHistory?: (movieId: number, progress: number) => void;
}

export default function TrailerModal({ movie, onClose, onRecordWatchHistory }: TrailerModalProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'trailer'>('stream');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(DEFAULT_PROVIDER_ID);
  const [muted, setMuted] = useState(false);
  const [useSimulated, setUseSimulated] = useState(false);
  const [isTheatreMode, setIsTheatreMode] = useState(false);

  // Map mock IDs to actual live TMDB IDs for sandbox playback fidelity
  const getMappedTmdbId = (id: number | string): string => {
    const map: Record<number | string, string> = {
      101: '693134', // Dune: Part Two
      102: '872585', // Oppenheimer
      103: '569094', // Spider-Man: Across the Spider-Verse
      104: '155',    // The Dark Knight
      105: '157336', // Interstellar
      106: '603692', // John Wick: Chapter 4
      107: '346698', // Barbie
      108: '546554', // Knives Out
      109: '772071'  // Everything Everywhere All at Once
    };
    return map[id] || String(id);
  };

  // Record an entry in watch history when the stream starts
  useEffect(() => {
    if (activeTab === 'stream' && onRecordWatchHistory) {
      // Simulate random starting progress if starting new, or pass back progress trigger
      onRecordWatchHistory(movie.id, Math.floor(Math.random() * 20) + 10); // e.g. 10% - 30%
    }
  }, [activeTab, movie.id]);

  // Safely build the YouTube embed URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    return `${url}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&controls=1`;
  };

  // Build TMDB movie stream URL
  const tmdbId = getMappedTmdbId(movie.id);
  const streamingUrl = getEmbedUrl(selectedProviderId, 'movie', tmdbId);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md animate-fade-in select-none">
      
      {/* Background overlay closer */}
      <div className="absolute inset-0 cursor-zoom-out bg-black/60" onClick={onClose} />

      {/* Main Video Frame Container with Theatre Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full transition-all duration-300 bg-[#0A0A0B] border border-white/5 overflow-hidden z-10 flex flex-col ${
          isTheatreMode 
            ? 'max-w-[96vw] h-[92vh] max-h-[92vh] rounded-2xl shadow-[0_0_80px_rgba(255,184,0,0.3)]' 
            : 'max-w-4xl rounded-2xl shadow-[0_0_50px_rgba(255,184,0,0.15)]'
        }`}
      >
        {/* Banner Header Bar */}
        <div className="px-4 py-3 bg-[#121214] flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vibrant-amber/10 flex items-center justify-center text-vibrant-amber shadow-[0_0_10px_rgba(255,184,0,0.15)]">
              <Tv className="w-4.5 h-4.5" />
            </div>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-black truncate text-zinc-100 font-display uppercase tracking-tight">
                {movie.title}
              </h2>
              <p className="text-[10px] text-zinc-400">
                Streaming Host: {providers.find(p => p.id === selectedProviderId)?.name || 'Direct CDN'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theatre mode switcher toggle */}
            <button
              onClick={() => setIsTheatreMode(!isTheatreMode)}
              className="px-2.5 py-1 text-4xs font-black uppercase rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-vibrant-amber hover:text-white transition flex items-center gap-1.5 bg-transparent"
              title={isTheatreMode ? "Exit Theatre Mode" : "Enter Theatre Mode"}
            >
              {isTheatreMode ? (
                <>
                  <Minimize2 className="w-3 h-3 text-vibrant-amber" />
                  <span>Exit Theatre</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3 h-3 text-vibrant-amber" />
                  <span>Theatre Mode</span>
                </>
              )}
            </button>

            {/* Direct Switch to Simulated Cinema */}
            <button
              onClick={() => setUseSimulated(!useSimulated)}
              className="px-2.5 py-1 text-4xs font-extrabold uppercase rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-vibrant-amber transition flex items-center gap-1 bg-transparent"
            >
              <Sparkles className="w-3 h-3 text-vibrant-amber" />
              <span>{useSimulated ? "Switch to YT Embed" : "Cinema Mode"}</span>
            </button>

            {/* Tab switch control */}
            <div className="flex bg-zinc-900 border border-white/5 rounded-lg p-0.5">
              <button
                onClick={() => {
                  setActiveTab('stream');
                  setUseSimulated(false);
                }}
                className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-md transition ${
                  activeTab === 'stream'
                    ? 'bg-vibrant-amber text-zinc-950 font-black'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                Stream Movie
              </button>
              <button
                onClick={() => {
                  setActiveTab('trailer');
                  setUseSimulated(false);
                }}
                className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-md transition ${
                  activeTab === 'trailer'
                    ? 'bg-vibrant-amber text-zinc-950 font-black'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                Trailer
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition active:scale-95 bg-transparent"
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Video Player stage */}
        <div className={`relative bg-black flex items-center justify-center transition-all duration-300 ${
          isTheatreMode ? 'flex-1 min-h-[340px]' : 'aspect-video w-full'
        }`}>
          <AnimatePresence mode="wait">
            {activeTab === 'stream' ? (
              <motion.div
                key="stream-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {useSimulated ? (
                  /* High Fidelity simulated player if embed fails */
                  <div className="absolute inset-0 w-full h-full relative overflow-hidden flex flex-col justify-between p-6">
                    <img
                      src={movie.backdrop_path}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-12 h-12 rounded-full border-2 border-vibrant-amber/20 border-t-vibrant-amber animate-spin" />
                        <span className="font-mono text-3xs font-bold text-vibrant-amber tracking-wider">SECURE LINK</span>
                      </div>
                      <span className="text-2xs text-zinc-400 animate-pulse font-light">Simulating Ultra HD Stream server buffers...</span>
                    </div>

                    <div className="absolute bottom-16 inset-x-12 text-center z-10">
                      <span className="px-3 py-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-white/5 text-xs sm:text-sm font-semibold tracking-wide text-zinc-100 leading-relaxed shadow-md">
                        &ldquo;Experience high-speed cloud playback optimized by SunnyMovies.&rdquo;
                      </span>
                    </div>

                    <div className="z-10 w-full mt-auto flex items-center justify-between bg-zinc-950/70 backdrop-blur-xs border border-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setMuted(!muted)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-90"
                          aria-label="Toggle mute state"
                        >
                          {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                        <span className="text-3xs font-mono text-zinc-400">0:14 / 2:38 [Sunny CDN Direct]</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          HDR 4K
                        </span>
                        <Maximize2 className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer transition" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={streamingUrl}
                    title={`${movie.title} full film player`}
                    className="w-full h-full border-0 bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="trailer-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {movie.trailer_url ? (
                  <iframe
                    src={getYoutubeEmbedUrl(movie.trailer_url)}
                    title={`${movie.title} official trailer player`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full relative overflow-hidden flex flex-col justify-between p-6">
                    <img
                      src={movie.backdrop_path}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                      <Play className="w-12 h-12 text-vibrant-amber animate-pulse" />
                      <span className="text-2xs text-zinc-400 font-light">Trailer unavailable. Loading direct film stream instead...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Streaming Servers Selector Panel (Shown if ActiveTab is Stream) */}
        {activeTab === 'stream' && (
          <div className="px-4 py-3 bg-[#0A0A0B] border-t border-b border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#FFB800] dark:text-vibrant-amber select-none">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Select High-Velocity Stream Server</span>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`text-3xs font-extrabold px-3 py-2 rounded-xl transition whitespace-nowrap active:scale-95 bg-transparent border ${
                    selectedProviderId === p.id
                      ? 'bg-vibrant-amber/20 text-vibrant-amber border-vibrant-amber/50 shadow-[0_0_12px_rgba(255,184,0,0.22)]'
                      : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer info snippet */}
        <div className="p-4 bg-[#121214] border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-zinc-100 uppercase tracking-tight">
              {movie.title} <span className="text-[10px] font-normal text-zinc-400">({movie.release_date.substring(0, 4)})</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-light line-clamp-1">{movie.overview}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-4xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3 h-3 fill-emerald-400" />
              <span>SECURE MULTI-THREAD STREAM</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
