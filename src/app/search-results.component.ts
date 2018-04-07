import { ChangeDetectorRef, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { catchError, debounceTime, distinctUntilChanged, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { Movie, SearchResult } from 'tmdb-typescript-api';
import { MovieCriticoned } from './criticon.model';

@Component({
  selector: 'app-search-results',
  template: `
    <div class="grid-2_sm-1">
      <div class="col" *ngFor="let movie of searchResult.results">
        <div class="item mat-elevation-z1">
          <img *ngIf="movie.poster_path" aria-hidden src="{{movie.poster_path}}" />
          <div *ngIf="!movie.poster_path" class="no_image_holder">
            <mat-icon>movie</mat-icon>
          </div>
          <mat-card class="mat-elevation-z0">
            <mat-card-header>
              <mat-card-title>{{ movie.title }}</mat-card-title>
              <mat-card-subtitle>{{movie.release_date | date}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              {{movie.critic}}
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `

    .item {
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
      height:100%
    }

    .mat-card {
      width: 100%;
    }

    .mat-card-title {
      font-size: 24px;
      margin-bottom: 8px;
    }

    div.no_image_holder {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #dbdbdb;
        color: #b5b5b5;
        box-sizing: border-box;
        border: 1px solid #d7d7d7;
        min-width: 185px;
        height: auto;
    }

    .mat-icon {
      font-size: 5rem;
      width: 5rem;
      height: 5rem;
      line-height: 5rem;
    }

    @media screen and (max-width: 400px) {
      .list > * {
        width: 100%;
      }
    }
  `
  ]
})
export class SearchResultsComponent implements OnChanges {
  @Input() searchResult: SearchResult<MovieCriticoned>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchResult) {
      this.searchResult.results.forEach(movie => {
        (movie.poster_path = this.getPosterUrl(movie.poster_path));
      });
    }
  }

  getPosterUrl(poster: string) {
    return poster ? `https://image.tmdb.org/t/p/w185${poster}` : null;
  }
}
