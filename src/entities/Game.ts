export interface Game {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  description_raw?: string;
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  metacritic: number | null;
  rating_top: number;
}

export interface FetchResponse<T> {
  count: number;
  next?: string | null;
  results: T[];
}

export type FetchGamesResponse = FetchResponse<Game>;
