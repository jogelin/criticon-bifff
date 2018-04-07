import { Movie } from 'tmdb-typescript-api';

export type MovieCriticoned = Movie & { critic: string };

export type Criticoner = (movie: Movie) => number;

export interface CriticonData {
  type: string;
  sentences: string[];
}
