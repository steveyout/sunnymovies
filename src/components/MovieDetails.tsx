/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Calendar, Bookmark, BookmarkCheck, Play, ExternalLink, Tv, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '../types';

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  runtime: number;
}

interface Season {
  season_number: number;
  name: string;
  episodes: Episode[];
}

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: number) => void;
  onPlayTrailer: (movie: Movie) => void;
  similarMovies: Movie[];
  onMovieClick: (id: number) => void;
}

export default function MovieDetails({
  movie,
  onBack,
  isWatchlisted,
  onToggleWatchlist,
  onPlayTrailer,
  similarMovies,
  onMovieClick
}: MovieDetailsProps) {
  const [activeSeasonNum, setActiveSeasonNum] = useState<number>(1);
  const [episodeSearch, setEpisodeSearch] = useState<string>("");

  useEffect(() => {
    setActiveSeasonNum(1);
    setEpisodeSearch("");
  }, [movie.id]);

  // Dynamic Seasons & Episodes Generator
  const getSeasonsAndEpisodes = (): Season[] => {
    const titleLower = (movie.title || "").toLowerCase();
    
    if (titleLower.includes("stranger things")) {
      return [
        {
          season_number: 1,
          name: "Season 1",
          episodes: [
            { episode_number: 1, name: "Chapter One: The Vanishing of Will Byers", overview: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a secret government lab unleashes a dark shadow.", air_date: "2016-07-15", runtime: 47, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Chapter Two: The Weirdo on Maple Street", overview: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Eleven displays telekinetic powers in Hawkins.", air_date: "2016-07-15", runtime: 55, still_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 3, name: "Chapter Three: Holly, Jolly", overview: "Nancy looks for Barb and finds out Jonathan is researching something. Joyce believes Will is trying to send a message via lights.", air_date: "2016-07-15", runtime: 51, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 4, name: "Chapter Four: The Body", overview: "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover to explore the school.", air_date: "2016-07-15", runtime: 50, still_path: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 5, name: "Chapter Five: The Flea and the Acrobat", overview: "Hopper breaks into the laboratory searching for answers, while the boys ask Mr. Clarke how to travel to another dimension.", air_date: "2016-07-15", runtime: 53, still_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 6, name: "Chapter Six: The Monster", overview: "Jonathan searches for Nancy in the darkness. Steve confronts Jonathan about Nancy. Joyce finds a mystery portal.", air_date: "2016-07-15", runtime: 46, still_path: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 7, name: "Chapter Seven: The Bathtub", overview: "The kids build a sensory deprivation tank so Eleven can search deep into the void for Will, while federal agents close in.", air_date: "2016-07-15", runtime: 41, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 8, name: "Chapter Eight: The Upside Down", overview: "Hopper and Joyce enter the Upside Down to search for Will. The kids face the Demogorgon in a final, explosive showdown.", air_date: "2016-07-15", runtime: 54, still_path: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" }
          ]
        },
        {
          season_number: 2,
          name: "Season 2",
          episodes: [
            { episode_number: 1, name: "Chapter One: MADMAX", overview: "A year after the events, Dustin and the boys visit the arcade and meet Max. Will experiences vivid flashing visions of a shadow giant.", air_date: "2017-10-27", runtime: 48, still_path: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Chapter Two: Trick or Treat, Freak", overview: "On Halloween night, Will experiences another terrifying episode, and Hopper digs up a field of rotting pumpkins.", air_date: "2017-10-27", runtime: 56, still_path: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 3, name: "Chapter Three: The Pollywog", overview: "Dustin adopts a strange slug-like creature he found in his trash, while Eleven becomes frustrated living in secret isolation.", air_date: "2017-10-27", runtime: 51, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 4, name: "Chapter Four: Will the Wise", overview: "Will pours out his visions onto paper in a series of drawings. Hopper becomes trapped deep underground in a tunnel of vines.", air_date: "2017-10-27", runtime: 46, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" }
          ]
        }
      ];
    }
    
    if (titleLower.includes("the last of us")) {
      return [
        {
          season_number: 1,
          name: "Season 1",
          episodes: [
            { episode_number: 1, name: "When You're Lost in the Darkness", overview: "In 2003, a parasitic fungal infection sparks a global pandemic. 20 years later, hardened survivor Joel is tasked with smuggling 14-year-old Ellie.", air_date: "2023-01-15", runtime: 81, still_path: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Infected", overview: "Joel, Tess, and Ellie navigate through the ruins of flooded Boston, facing hordes of terrifying Clickers and runner mutations.", air_date: "2023-01-22", runtime: 53, still_path: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 3, name: "Long, Long Time", overview: "The poignant story of Bill and Frank, two survivors who carved out a peaceful haven in an isolated town amid the apocalypse.", air_date: "2023-01-29", runtime: 75, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 4, name: "Please Hold to My Hand", overview: "After travelling through Missouri, Joel and Ellie are ambushed by a ruthless populist group of survivors in Kansas City.", air_date: "2023-02-05", runtime: 46, still_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 5, name: "Endure and Survive", overview: "In Kansas City, Joel and Ellie partner with brothers Henry and Sam to escape via underground tunnels before the rebellion catches them.", air_date: "2023-02-10", runtime: 59, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" }
          ]
        }
      ];
    }

    if (titleLower.includes("wednesday")) {
      return [
        {
          season_number: 1,
          name: "Season 1",
          episodes: [
            { episode_number: 1, name: "Wednesday's Child Is Full of Woe", overview: "When a piranha prank gets Wednesday expelled, she is sent to Nevermore Academy, the boarding school where her parents met.", air_date: "2022-11-23", runtime: 59, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Woe Is the Loneliest Number", overview: "Wednesday assists Sheriff Galpin in investigating a deadly monster attack, and competes in the brutal Poe Cup boat race.", air_date: "2022-11-23", runtime: 48, still_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 3, name: "Friend or Woe", overview: "Wednesday stumbles upon a secret society of outcasts and discovers a dark connection in the town's legendary history.", air_date: "2022-11-23", runtime: 48, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" }
          ]
        }
      ];
    }

    if (titleLower.includes("breaking bad")) {
      return [
        {
          season_number: 1,
          name: "Season 1",
          episodes: [
            { episode_number: 1, name: "Pilot", overview: "Diagnosed with terminal lung cancer, high school chemistry teacher Walter White decides to partner up with Jesse Pinkman to cook meth.", air_date: "2008-01-20", runtime: 58, still_path: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Cat's in the Bag...", overview: "Walt and Jesse clean up the aftermath of their first drug cook, and are forced to deal with two dangerous captives in Jesse's basement.", air_date: "2008-01-27", runtime: 48, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 3, name: "And the Bag's in the River...", overview: "Walt is forced to make a difficult decision regarding Krazy-8's fate, while Skyler grows increasingly suspicious of Jesse.", air_date: "2008-02-10", runtime: 48, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" }
          ]
        },
        {
          season_number: 2,
          name: "Season 2",
          episodes: [
            { episode_number: 1, name: "Seven Thirty-Seven", overview: "Walt and Jesse realize just how unstable and murderous their new distributor Tuco Salamanca truly is.", air_date: "2009-03-08", runtime: 47, still_path: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80" },
            { episode_number: 2, name: "Grilled", overview: "Kidnapped by Tuco, Walt and Jesse are held hostage in a desert shack alongside Tuco's silent uncle Hector Salamanca.", air_date: "2009-03-15", runtime: 48, still_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" }
          ]
        }
      ];
    }

    // Default Fallback Tv Show Seasons Generator
    return [
      {
        season_number: 1,
        name: "Season 1",
        episodes: [
          { episode_number: 1, name: "Episode 1: Pilot", overview: `Meet the primary characters and follow the opening chapters of ${movie.title} in this exciting series premiere.`, air_date: "2024-01-10", runtime: 45, still_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
          { episode_number: 2, name: "Episode 2: The Plot Thickens", overview: "Secrets begin to surface as rival factions collide and new challenges emerge for our main characters.", air_date: "2024-01-17", runtime: 43, still_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80" },
          { episode_number: 3, name: "Episode 3: Secrets Unveiled", overview: "A critical discovery changes the course of the journey, forcing key alliances to be questioned.", air_date: "2024-01-24", runtime: 46, still_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80" },
          { episode_number: 4, name: "Episode 4: Mid-Season Finale", overview: "Tension reaches an all-time high with a dramatic cliffhanger that leaves everyone's fate hanging in the balance.", air_date: "2024-01-31", runtime: 51, still_path: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80" }
        ]
      },
      {
        season_number: 2,
        name: "Season 2",
        episodes: [
          { episode_number: 1, name: "Episode 1: The Return", overview: "Following the dramatic aftermath of last season's events, the survivors pick up the pieces and lay down new roots.", air_date: "2024-10-05", runtime: 44, still_path: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80" },
          { episode_number: 2, name: "Episode 2: New Frontiers", overview: "The cast confronts a mysterious set of coordinates that leads them into unchartered and dangerous territory.", air_date: "2024-10-12", runtime: 48, still_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" }
        ]
      }
    ];
  };

  const isShow = movie.is_tv_show || (movie.category && movie.category.toLowerCase().includes("show")) || movie.genres.some(g => g.toLowerCase().includes("tv") || g.toLowerCase().includes("show"));
  const seasonsData = isShow ? getSeasonsAndEpisodes() : [];
  const currentSeason = seasonsData.find(s => s.season_number === activeSeasonNum) || seasonsData[0];
  const filteredEpisodes = currentSeason 
    ? currentSeason.episodes.filter(ep => 
        ep.name.toLowerCase().includes(episodeSearch.toLowerCase()) ||
        ep.overview.toLowerCase().includes(episodeSearch.toLowerCase())
      )
    : [];

  const castList = (movie.cast && movie.cast.length > 0) ? movie.cast : (
    movie.is_tv_show ? [
      { name: "Pedro Pascal", character: "Lead Survivor", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Bella Ramsey", character: "Key Protagonist", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" },
      { name: "David Harbour", character: "Chief Sheriff", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Winona Ryder", character: "Devoted Mother", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ] : [
      { name: "Cillian Murphy", character: "The Creator", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Emily Blunt", character: "Loyal Companion", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Robert Downey Jr.", character: "Rival Strategist", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Matt Damon", character: "Lieutenant General", profile_path: "https://images.unsplash.com/photo-1504257401700-13e9ff31350c?auto=format&fit=crop&w=200&q=80" }
    ]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="pb-24 max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* Back button Row */}
      <div className="flex items-center justify-between py-4 mb-3 border-b border-zinc-150 dark:border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-vibrant-amber dark:hover:text-vibrant-amber group transition-all bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Action indicator for streaming availability */}
          <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider">
            SEO Index Ready
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Main Showcase Billboard View */}
      <div className="relative w-full h-[260px] md:h-[400px] rounded-3xl overflow-hidden bg-zinc-950 mb-8 border border-zinc-200/50 dark:border-white/5 shadow-md">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover filter brightness-[0.34] object-top"
          referrerPolicy="no-referrer"
        />

        {/* Shadow overlays */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950/90 to-transparent" />

        {/* Play Action Float */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => onPlayTrailer(movie)}
            className="w-16 h-16 rounded-full bg-vibrant-amber text-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.4)] hover:scale-108 transition-all active:scale-95 group font-bold bg-transparent"
            title="Watch film trailer"
          >
            <Play className="w-7 h-7 fill-zinc-950 ml-1 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Title details bar */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div className="space-y-1.5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg text-3xs font-black bg-vibrant-amber text-zinc-950 uppercase tracking-widest leading-none">
                {movie.category}
              </span>
              <span className="text-3xs font-semibold text-zinc-300">Released: {movie.release_date}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase italic leading-none">
              {movie.title}
            </h1>
          </div>

          <button
            onClick={() => onToggleWatchlist(movie.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-xs shadow-md transition-all active:scale-95 ${
              isWatchlisted
                ? 'bg-vibrant-amber text-zinc-950 border-transparent shadow-[0_0_15px_rgba(255,184,0,0.4)] font-black'
                : 'bg-white/10 text-white border-white/15 backdrop-blur-md hover:bg-white/20'
            }`}
          >
            {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isWatchlisted ? 'In Your Library' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Grid Content Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Poster and Streams tags */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hidden lg:block aspect-[2/3] rounded-3xl overflow-hidden shadow-md border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-[#1E1E21]">
            <img
              src={movie.poster_path}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* STREAMING CHANNELS BADGES CARD - "Include tags of popular streaming sites" */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#1E1E21] border border-zinc-200/60 dark:border-white/5 space-y-4 shadow-3xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-200">
                Where to Stream Online
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-vibrant-amber/10 text-vibrant-amber">
                Aggregated
              </span>
            </div>

            <p className="text-3xs text-zinc-400 leading-relaxed font-light">
              This movie is indexed on the following popular channels. Click safely to launch video streaming instantly on official servers:
            </p>

            {movie.streaming_platforms && movie.streaming_platforms.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5">
                {movie.streaming_platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-white/5 bg-white dark:bg-[#121214] transition-all hover:scale-[1.01] hover:border-vibrant-amber hover:shadow-[0_0_10px_rgba(255,184,0,0.12)] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-xs ${p.badgeColor}`}>
                        {p.logo}
                      </div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-vibrant-amber dark:group-hover:text-vibrant-amber transition-colors">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-3xs font-extrabold text-[#FFB800] dark:text-vibrant-amber flex items-center gap-1 bg-transparent">
                      <span>Stream Site</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No stream locations indexed currently.</p>
            )}
          </div>
        </div>

        {/* Right column: Synopsis, Cast, Reviews info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Metadata chips row */}
          <div className="flex flex-wrap items-center gap-4 py-1.5">
            <div className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-300">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold">{movie.runtime ? `${movie.runtime}m` : '126m'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-300">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold">{(movie.release_date || '').substring(0, 4)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-300">
              <span className="text-3xs font-bold uppercase rounded px-2 py-0.5 bg-zinc-150 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700">
                Rated {movie.rating || "PG-13"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-655 dark:text-zinc-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold">{movie.vote_average.toFixed(1)} / 10</span>
              <span className="text-3xs text-zinc-450">({movie.vote_count} votes)</span>
            </div>
          </div>

          {/* Synopsis Plot card */}
          <div className="space-y-2.5">
            <h2 className="font-display font-extrabold text-lg text-zinc-800 dark:text-zinc-200">
              Synopsis
            </h2>
            <p className="text-sm font-light text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {movie.overview}
            </p>
          </div>

          {/* Genres row list */}
          <div className="flex flex-wrap gap-2 pt-1">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-850 border border-zinc-200/30 dark:border-zinc-750 text-xs text-zinc-600 dark:text-zinc-350 rounded-lg text-center font-semibold"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Enhanced Cinematic Scoreboard Module */}
          <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-[#1E1E21] border border-zinc-200/60 dark:border-white/5 space-y-4 shadow-3xs">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-neutral-800 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-vibrant-amber rounded-full animate-pulse" />
              <span>Cinematic Critique Indicators</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-3xs font-mono font-bold text-zinc-500 uppercase">
                  <span>Audience Favorability</span>
                  <span className="text-[#FFB800]">{Math.round(movie.vote_average * 10)}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${movie.vote_average * 10}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-vibrant-amber h-full rounded-full shadow-[0_0_8px_rgba(255,184,0,0.4)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-3xs font-mono font-bold text-zinc-500 uppercase">
                  <span>Direct Cine Craft</span>
                  <span className="text-[#FFB800]">92%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `92%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-vibrant-amber h-full rounded-full shadow-[0_0_8px_rgba(255,184,0,0.4)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-3xs font-mono font-bold text-zinc-500 uppercase">
                  <span>Atmospheric Vibe Index</span>
                  <span className="text-[#FFB800]">88%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `88%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-vibrant-amber h-full rounded-full shadow-[0_0_8px_rgba(255,184,0,0.4)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEASONS & EPISODES MODULE FOR TV SHOWS */}
          {isShow && seasonsData.length > 0 && (
            <div className="space-y-6 pt-5 border-t border-zinc-150 dark:border-zinc-800/50 animate-enter">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-display font-extrabold text-lg text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-vibrant-amber" />
                    <span>Seasons & Episodes</span>
                  </h2>
                  <p className="text-3xs text-zinc-400 dark:text-zinc-500 font-light truncate">
                    Explore individual chapters and tap an episode card to preview.
                  </p>
                </div>

                {/* Episode Search Filter Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search episode or summary..."
                    value={episodeSearch}
                    onChange={(e) => setEpisodeSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-vibrant-amber shadow-3xs transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                  {episodeSearch && (
                    <button
                      onClick={() => setEpisodeSearch("")}
                      className="absolute right-2 px-1.5 focus:outline-hidden top-1/2 -translate-y-1/2 text-2xs font-extrabold text-zinc-400 hover:text-red-500 bg-transparent cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Seasons Selector Tab (scrollable flex bar) */}
              <div className="flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-800/60 pb-2 overflow-x-auto no-scrollbar scroll-smooth snap-x">
                {seasonsData.map((s) => (
                  <button
                    key={s.season_number}
                    onClick={() => {
                      setActiveSeasonNum(s.season_number);
                    }}
                    className={`px-4 py-2 rounded-xl text-2xs font-black uppercase tracking-wider transition-all duration-200 snap-center shrink-0 cursor-pointer ${
                      activeSeasonNum === s.season_number
                        ? 'bg-vibrant-amber text-zinc-950 font-black shadow-[0_0_12px_rgba(255,184,0,0.3)] border-transparent'
                        : 'bg-zinc-155 dark:bg-zinc-850/60 border border-transparent text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Episodes Grid List */}
              {filteredEpisodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEpisodes.map((ep) => (
                    <div
                      key={ep.episode_number}
                      className="group flex flex-col sm:flex-row bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-850/50 transition-all hover:scale-[1.01] hover:border-vibrant-amber dark:hover:border-vibrant-amber/30 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] shadow-3xs"
                    >
                      {/* Left: Thumbnail container */}
                      <div className="sm:w-36 aspect-video shrink-0 relative bg-zinc-200 dark:bg-zinc-850">
                        <img
                          src={ep.still_path}
                          alt={ep.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-zinc-950/75 border border-white/15 text-[9px] font-mono leading-none tracking-wider text-white">
                          EPISODE {ep.episode_number}
                        </div>
                        {/* Play overlay button */}
                        <div 
                          onClick={() => onPlayTrailer(movie)}
                          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-3xs"
                        >
                          <div className="w-8 h-8 rounded-full bg-vibrant-amber text-zinc-950 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <Play className="w-3.5 h-3.5 fill-zinc-950 ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Right: details info */}
                      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-150 truncate group-hover:text-vibrant-amber transition-colors">
                              {ep.name}
                            </h4>
                          </div>
                          <p className="text-3xs text-zinc-400 dark:text-zinc-500 font-medium">
                            {ep.air_date} • {ep.runtime} mins
                          </p>
                          <p className="text-3xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed line-clamp-3">
                            {ep.overview}
                          </p>
                        </div>

                        {/* Quick Stream Trigger */}
                        <button
                          onClick={() => onPlayTrailer(movie)}
                          className="mt-2 text-3xs font-black uppercase text-vibrant-amber hover:text-amber-500 flex items-center gap-1.5 tracking-wider bg-transparent cursor-pointer font-sans text-left focus:outline-hidden"
                        >
                          <Play className="w-2.5 h-2.5 fill-vibrant-amber" />
                          <span>Stream Episode</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-zinc-500 font-light">No episodes match your search criteria. Try a different query!</p>
                </div>
              )}
            </div>
          )}

          {/* Cast Members Container */}
          {castList && castList.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="font-display font-extrabold text-lg text-zinc-800 dark:text-zinc-200">
                Principal Characters & Cast
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {castList.map((cast, idx) => (
                  <div
                    key={`${cast.name}-${idx}`}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 flex flex-col items-center text-center space-y-2 shadow-3xs"
                  >
                    <img
                      src={cast.profile_path}
                      alt={cast.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-zinc-200/85 dark:border-zinc-700/80 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-2xs font-extrabold text-zinc-800 dark:text-zinc-200 truncate max-w-full">
                        {cast.name}
                      </h4>
                      <p className="text-[10px] text-zinc-450 truncate max-w-full font-light mt-0.5">
                        {cast.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Recommended movies block */}
          {similarMovies && similarMovies.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-800/70">
              <h2 className="font-display font-extrabold text-lg text-zinc-850 dark:text-zinc-200">
                You May Also Like
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarMovies.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onMovieClick(item.id)}
                    className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 cursor-pointer shadow-3xs transition hover:-translate-y-1"
                  >
                    <div className="aspect-[3/2] overflow-hidden relative bg-zinc-150">
                      <img
                        src={item.backdrop_path}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-zinc-950/75 border border-white/10 text-white text-[9px] font-bold">
                        ★ {item.vote_average.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-250 truncate group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-450 mt-0.5 truncate font-light">
                        {item.genres.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </motion.div>
  );
}
