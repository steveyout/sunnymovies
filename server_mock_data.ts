/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, StreamingPlatform } from './src/types';

export const STREAMING_PLATFORMS: Record<string, StreamingPlatform> = {
  netflix: {
    name: "Netflix",
    url: "https://www.netflix.com",
    logo: "N",
    badgeColor: "bg-red-600 text-white hover:bg-red-700",
    accentColor: "#E50914"
  },
  disney: {
    name: "Disney+",
    url: "https://www.disneyplus.com",
    logo: "D+",
    badgeColor: "bg-blue-900 text-sky-200 hover:bg-blue-950",
    accentColor: "#0063E5"
  },
  prime: {
    name: "Prime Video",
    url: "https://www.primevideo.com",
    logo: "PV",
    badgeColor: "bg-sky-500 text-slate-900 hover:bg-sky-600",
    accentColor: "#00A8E1"
  },
  max: {
    name: "Max",
    url: "https://www.max.com",
    logo: "M",
    badgeColor: "bg-indigo-700 text-white hover:bg-indigo-800",
    accentColor: "#0023ee"
  },
  hulu: {
    name: "Hulu",
    url: "https://www.hulu.com",
    logo: "H",
    badgeColor: "bg-emerald-500 text-slate-950 hover:bg-emerald-600",
    accentColor: "#1CE783"
  }
};

// High-resolution curated Unsplash poster/backdrop image links matching movie themes perfectly
export const MOCK_MOVIES: Movie[] = [
  {
    id: 101,
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    poster_path: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    release_date: "2024-03-01",
    vote_average: 8.9,
    vote_count: 4210,
    genres: ["Sci-Fi", "Action", "Adventure"],
    runtime: 166,
    rating: "PG-13",
    category: "Sci-Fi",
    is_trending: true,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/Way9Dexny3w",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Zendaya", character: "Chani", profile_path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
      { name: "Rebecca Ferguson", character: "Lady Jessica Atreides", profile_path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.max, STREAMING_PLATFORMS.hulu]
  },
  {
    id: 102,
    title: "Oppenheimer",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, charting the technical brilliance, the political paranoia, and the personal drama that altered humanity forever.",
    poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-07-21",
    vote_average: 8.7,
    vote_count: 5890,
    genres: ["Drama", "History", "Biography"],
    runtime: 180,
    rating: "R",
    category: "Drama",
    is_trending: true,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/uYPbbksJxIg",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Matt Damon", character: "Leslie Groves", profile_path: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" },
      { name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.prime]
  },
  {
    id: 103,
    title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    poster_path: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-06-02",
    vote_average: 9.1,
    vote_count: 3820,
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    runtime: 140,
    rating: "PG",
    category: "Action",
    is_trending: true,
    is_popular: false,
    trailer_url: "https://www.youtube.com/embed/shW9i6k8cB0",
    cast: [
      { name: "Shameik Moore", character: "Miles Morales / Spider-Man", profile_path: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80" },
      { name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" },
      { name: "Oscar Isaac", character: "Miguel O'Hara / Spider-Man 2099", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix]
  },
  {
    id: 104,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known as The Joker.",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
    release_date: "2008-07-18",
    vote_average: 9.0,
    vote_count: 14500,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    rating: "PG-13",
    category: "Action",
    is_trending: false,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Heath Ledger", character: "The Joker", profile_path: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80" },
      { name: "Gary Oldman", character: "Jim Gordon", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.max]
  },
  {
    id: 105,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage. Our Earth is decaying, and a daring flight is our last hope.",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=80",
    release_date: "2014-11-07",
    vote_average: 8.8,
    vote_count: 11020,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    runtime: 169,
    rating: "PG-13",
    category: "Sci-Fi",
    is_trending: true,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/zSWdZVtXT7E",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Anne Hathaway", character: "Brand", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Jessica Chastain", character: "Murph (Adult)", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix, STREAMING_PLATFORMS.prime]
  },
  {
    id: 106,
    title: "John Wick: Chapter 4",
    overview: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into deadly foes.",
    poster_path: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-03-24",
    vote_average: 8.5,
    vote_count: 2900,
    genres: ["Action", "Thriller", "Crime"],
    runtime: 169,
    rating: "R",
    category: "Action",
    is_trending: false,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/qEVUTrgpmK0",
    cast: [
      { name: "Keanu Reeves", character: "John Wick", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Donnie Yen", character: "Caine", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Bill Skarsgård", character: "Marquis", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.prime, STREAMING_PLATFORMS.netflix]
  },
  {
    id: 107,
    title: "Barbie",
    overview: "Stereotypical Barbie is having a self-actualization crisis. To solve it, she must travel into the human world with her boyfriend, Ken, and understand her feelings, experiencing the friction and joy of real-world complexity.",
    poster_path: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-07-21",
    vote_average: 8.2,
    vote_count: 5100,
    genres: ["Comedy", "Fantasy", "Adventure"],
    runtime: 114,
    rating: "PG-13",
    category: "Comedy",
    is_trending: true,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/pBk4NYhWNMM",
    cast: [
      { name: "Margot Robbie", character: "Barbie", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Ryan Gosling", character: "Ken", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "America Ferrera", character: "Gloria", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.max]
  },
  {
    id: 108,
    title: "Knives Out",
    overview: "When renowned crime novelist Harlan Thrombey is found dead at his estate just after his 85th birthday, the inquisitive and debonair Detective Benoit Blanc is mysteriously enlisted to investigate. From Harlan's dysfunctional family to his devoted staff, Blanc sifts through a web of red herrings and self-serving lies to uncover the truth.",
    poster_path: "https://images.unsplash.com/photo-1513790197207-054b1d680937?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1600&q=80",
    release_date: "2019-11-27",
    vote_average: 8.4,
    vote_count: 8120,
    genres: ["Mystery", "Comedy", "Drama"],
    runtime: 130,
    rating: "PG-13",
    category: "Comedy",
    is_trending: false,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/qGqiHJTsRkQ",
    cast: [
      { name: "Daniel Craig", character: "Benoit Blanc", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Ana de Armas", character: "Marta Cabrera", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Chris Evans", character: "Ransom Drysdale", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix]
  },
  {
    id: 109,
    title: "Everything Everywhere All at Once",
    overview: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    poster_path: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1500485035595-cbeaf2721d7b?auto=format&fit=crop&w=1600&q=80",
    release_date: "2022-03-24",
    vote_average: 8.6,
    vote_count: 4950,
    genres: ["Sci-Fi", "Action", "Comedy", "Drama"],
    runtime: 139,
    rating: "R",
    category: "Sci-Fi",
    is_trending: false,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/wxN1T1uxQ2g",
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Wang", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Ke Huy Quan", character: "Waymond Wang", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
      { name: "Jamie Lee Curtis", character: "Deirdre Beaubeirdre", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix, STREAMING_PLATFORMS.hulu]
  },
  {
    id: 110,
    title: "La La Land",
    overview: "While navigating their careers in Los Angeles, Mia, an aspiring actress, and Sebastian, a dedicated jazz musician, fall in love while struggling to reconcile aspirations for their future with their romantic commitment.",
    poster_path: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    release_date: "2016-12-09",
    vote_average: 8.5,
    vote_count: 9110,
    genres: ["Romance", "Drama", "Music"],
    runtime: 128,
    rating: "PG-13",
    category: "Romance",
    is_trending: true,
    is_popular: false,
    trailer_url: "https://www.youtube.com/embed/0pdqf4P9MB8",
    cast: [
      { name: "Ryan Gosling", character: "Sebastian", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Emma Stone", character: "Mia", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "John Legend", character: "Keith", profile_path: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix, STREAMING_PLATFORMS.disney]
  },
  {
    id: 111,
    title: "Past Lives",
    overview: "Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora's family emigrates from South Korea. Decades later, they are reunited for one fateful week in New York as they confront notions of destiny, love, and the choices that make a life.",
    poster_path: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-06-02",
    vote_average: 8.4,
    vote_count: 1450,
    genres: ["Romance", "Drama"],
    runtime: 105,
    rating: "PG-13",
    category: "Romance",
    is_trending: false,
    is_popular: true,
    trailer_url: "https://www.youtube.com/embed/kA244xewM9M",
    cast: [
      { name: "Greta Lee", character: "Nora", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Teo Yoo", character: "Hae Sung", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "John Magaro", character: "Arthur", profile_path: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.max, STREAMING_PLATFORMS.hulu]
  },
  {
    id: 201,
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
    release_date: "2016-07-15",
    vote_average: 8.8,
    vote_count: 16200,
    genres: ["Sci-Fi", "Drama", "Mystery"],
    runtime: 50,
    rating: "TV-14",
    category: "Sci-Fi",
    is_trending: true,
    is_popular: true,
    is_tv_show: true,
    trailer_url: "https://www.youtube.com/embed/b9EkMc79ZSU",
    cast: [
      { name: "Millie Bobby Brown", character: "Eleven", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Finn Wolfhard", character: "Mike Wheeler", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Winona Ryder", character: "Joyce Byers", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix]
  },
  {
    id: 202,
    title: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.",
    poster_path: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=80",
    release_date: "2023-01-15",
    vote_average: 8.7,
    vote_count: 4300,
    genres: ["Action", "Drama", "Sci-Fi"],
    runtime: 60,
    rating: "TV-MA",
    category: "Action",
    is_trending: true,
    is_popular: true,
    is_tv_show: true,
    trailer_url: "https://www.youtube.com/embed/uLtkt8BonwM",
    cast: [
      { name: "Pedro Pascal", character: "Joel Miller", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Bella Ramsey", character: "Ellie Williams", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.max]
  },
  {
    id: 203,
    title: "Wednesday",
    overview: "Wednesday Addams' misadventures as a student at Nevermore Academy, a very unique boarding school. She attempts to master her emerging psychic ability, thwart a monstrous killing spree, and solve the supernatural mystery that embroiled her parents 25 years ago.",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1600&q=80",
    release_date: "2022-11-23",
    vote_average: 8.5,
    vote_count: 7600,
    genres: ["Comedy", "Fantasy", "Mystery"],
    runtime: 45,
    rating: "TV-14",
    category: "Comedy",
    is_trending: false,
    is_popular: true,
    is_tv_show: true,
    trailer_url: "https://www.youtube.com/embed/Di310WS8zLk",
    cast: [
      { name: "Jenna Ortega", character: "Wednesday Addams", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Emma Myers", character: "Enid Sinclair", profile_path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix]
  },
  {
    id: 204,
    title: "Breaking Bad",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    poster_path: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1500485035595-cbeaf2721d7b?auto=format&fit=crop&w=1600&q=80",
    release_date: "2008-01-20",
    vote_average: 9.5,
    vote_count: 12900,
    genres: ["Drama", "Crime"],
    runtime: 49,
    rating: "TV-MA",
    category: "Drama",
    is_trending: true,
    is_popular: true,
    is_tv_show: true,
    trailer_url: "https://www.youtube.com/embed/HhesaQXLuRY",
    cast: [
      { name: "Bryan Cranston", character: "Walter White", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Aaron Paul", character: "Jesse Pinkman", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    streaming_platforms: [STREAMING_PLATFORMS.netflix]
  }
];
