// ponytail: static snapshot from RAWG 2026-08-30, re-fetch via /tmp/genres.json if RAWG adds genres
import type { Genre } from "../entities/Genre";

export const genres: Genre[] = [
  { id: 4, name: 'Action', image_background: 'https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg' },
  { id: 51, name: 'Indie', image_background: 'https://media.rawg.io/media/games/174/1743b3dd185bda4a7be349347d4064df.jpg' },
  { id: 3, name: 'Adventure', image_background: 'https://media.rawg.io/media/games/baf/baf9905270314e07e6850cffdb51df41.jpg' },
  { id: 5, name: 'RPG', image_background: 'https://media.rawg.io/media/games/095/0953bf01cd4e4dd204aba85489ac9868.jpg' },
  { id: 10, name: 'Strategy', image_background: 'https://media.rawg.io/media/games/25c/25c4776ab5723d5d735d8bf617ca12d9.jpg' },
  { id: 2, name: 'Shooter', image_background: 'https://media.rawg.io/media/games/737/737ea5662211d2e0bbd6f5989189e4f1.jpg' },
  { id: 40, name: 'Casual', image_background: 'https://media.rawg.io/media/games/66e/66e90c9d7b9a17335b310ceb294e9365.jpg' },
  { id: 14, name: 'Simulation', image_background: 'https://media.rawg.io/media/games/997/997ab4d67e96fb20a4092383477d4463.jpg' },
  { id: 7, name: 'Puzzle', image_background: 'https://media.rawg.io/media/games/6d3/6d33014a4ed48a19c30a77ead5a0f62e.jpg' },
  { id: 11, name: 'Arcade', image_background: 'https://media.rawg.io/media/games/37a/37a9536e92cf8fe3b60045aa75dbd41f.jpg' },
  { id: 83, name: 'Platformer', image_background: 'https://media.rawg.io/media/screenshots/c97/c97b943741f5fbc936fe054d9d58851d.jpg' },
  { id: 59, name: 'Massively Multiplayer', image_background: 'https://media.rawg.io/media/games/5f6/5f61441e6338e9221f96a8f4c64c7bb8.jpg' },
  { id: 1, name: 'Racing', image_background: 'https://media.rawg.io/media/games/ff6/ff66ce127716df74175961831ad3a23a.jpg' },
  { id: 15, name: 'Sports', image_background: 'https://media.rawg.io/media/games/d16/d160819f22de73d29813f7b6dad815f9.jpg' },
  { id: 6, name: 'Fighting', image_background: 'https://media.rawg.io/media/games/d2e/d2ee15fda80056efef174da4ca5ae54f.jpg' },
  { id: 19, name: 'Family', image_background: 'https://media.rawg.io/media/games/694/6940fa3fbe0d836e4a272c468e65e480.jpg' },
  { id: 28, name: 'Board Games', image_background: 'https://media.rawg.io/media/screenshots/edc/edc436cb992c4454d184ee300add4906.jpeg' },
  { id: 17, name: 'Card', image_background: 'https://media.rawg.io/media/screenshots/4a0/4a0f7b914b8e9e05abd6bbd480ed2b9d.jpg' },
  { id: 34, name: 'Educational', image_background: 'https://media.rawg.io/media/games/5ba/5ba70c842aaf82176ff47618f776a498.jpg' },
];

export default genres;
