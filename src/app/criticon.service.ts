import { Injectable } from '@angular/core';
import { Movie } from 'tmdb-typescript-api';
import { Criticoner, MovieCriticoned, CriticonData } from './criticon.model';
import { data } from './data';

export const reduceDigit = (value: number) => {
  let sum = 0;
  while (value) {
    sum += value % 10;
    value = Math.floor(value / 10);
  }
  return sum > 10 ? reduceDigit(sum) : sum;
};

@Injectable()
export class Criticon {
  rules: { [key: string]: Criticoner } = {
    FirstLetterInTitle: (movie: Movie): number => {
      const letterToIndexRegex = ['A|J', 'B|K|T', 'C|L|U', 'D|M|V', 'E|N|W', 'F|O|X', 'G|P|Y', 'H|Q|Z', 'I|R', 'S'];

      for (let i = 0; i < letterToIndexRegex.length; i++) {
        if (new RegExp(letterToIndexRegex[i], 'g').test(movie.title[0].toUpperCase())) {
          return i;
        }
      }
      return null;
    },
    CountTitleLetterAndReduceDigit: (movie: Movie): number => reduceDigit(movie.title.replace(/\s/g, '').length),
    ReleaseYearReduceSumNumber: (movie: Movie): number => reduceDigit(new Date(movie.release_date).getFullYear())
  };

  critic(movie: Movie): MovieCriticoned {
    const critic = data.reduce((acc, val) => {
      const indexSentence = this.rules[val.type](movie);
      return acc + ' ' + val.sentences[indexSentence];
    }, '');

    return { ...movie, critic: critic };
  }
}
