import type Genre from "./Genre";
import type Publisher from "./Publisher";

export default interface Game {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  description_raw?: string;
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  metacritic: number | null;
  rating_top: number;
  genres: Genre[];
  publishers: Publisher[];
}
