export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  metacritic: number | null;
  rating_top: number;
}

export interface FetchResponse<T> {
  count: number;
  results: T[];
}

export type FetchGamesResponse = FetchResponse<Game>;
