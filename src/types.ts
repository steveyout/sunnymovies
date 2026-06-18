/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CastMember {
  name: string;
  character: string;
  profile_path?: string;
}

export interface StreamingPlatform {
  name: string;
  url: string;
  logo: string;
  badgeColor: string;
  accentColor: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: string[];
  runtime?: number;
  trailer_url?: string;
  cast?: CastMember[];
  streaming_platforms?: StreamingPlatform[];
  rating?: string;
  category?: string;
  is_trending?: boolean;
  is_popular?: boolean;
  is_tv_show?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  preferred_genres: string[];
  watchlist: number[]; // movie IDs
  watch_history: {
    movie_id: number;
    watched_at: string;
    progress: number; // percentage completed
  }[];
}

export type ViewType = 'home' | 'movie' | 'search' | 'watchlist' | 'profile';

export interface AppState {
  theme: 'light' | 'dark';
  currentView: ViewType;
  selectedMovieId: number | null;
  watchlist: number[];
  searchQuery: string;
  profile: UserProfile;
}
