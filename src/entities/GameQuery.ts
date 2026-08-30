import type { Genre } from "./Genre";
import type { Platform } from "./Platform";

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}
