export interface Game {
  id: number;
  background_image: string;
  name: string;
  released: string;
  metacritic_url: string;
  website: string;
  description: string;
  metacritic: number;
  genres: Genre[];
  parent_platforms: ParentPlatform[];
  publishers: Publishers[];
  ratings: Rating[];
  screenshots: Screenshots[];
  trailers: Trailer[];
}

export interface GameDetails {
  id: number;
  name: string;
  background_image: string;
  released: string;
  parent_platforms: ParentPlatform[];
  description: string;
  publishers: Publishers[];
  website: string;
  metacritic: number;
  // Add other fields you expect from the API...
}
export interface ApiResponse {
  count: number;
  results: Game[];
}

interface Genre {
  name: string;
}

interface ParentPlatform {
  platform: {
    id: string;
    slug: string;
    name: string;
  };
}

interface Publishers {
  name: string;
}

interface Rating {
  id: number;
  count: number;
  title: string;
}

export interface Screenshots {
  count: number;
  results: ScreenshotResult[];
}

export interface Trailer {
  count: number;
  results: TrailerResult[];
}

interface ScreenshotResult {
  id: number;
  image: string;
  height: number;
  width: number;
  isDeleted: boolean;
}

interface TrailerResult {
  url: string;
  id: number;
}
