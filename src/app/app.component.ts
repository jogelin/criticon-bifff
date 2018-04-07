import { Subject } from 'rxjs/Subject';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TmdbApi, Movie, SearchResult } from 'tmdb-typescript-api';
import { environment } from '../environments/environment';
import { PartialObserver } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Criticon } from './criticon.service';
import { MovieCriticoned } from './criticon.model';


@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="mat-elevation-z1 grid-3_xs-1">
      <app-search-field class="col-12" [loading]="loading" [observer]="observer"></app-search-field>
    </mat-toolbar>

    <div class="content">
      <ng-container *ngIf="(searchResult$ | async) as searchResult">
        <app-search-results [searchResult]="searchResult"></app-search-results>
      </ng-container>
    </div>
  `,
  styles: [
    `
    .content {
      margin-top: 96px;
      padding: 16px;
    }

    .mat-toolbar{
      height:96px;
      position: fixed;
      top: 0;
      z-index: 9999;
    }
  `
  ]
})
export class AppComponent implements OnInit {
  api: TmdbApi = new TmdbApi(environment.tmdbApiKey);

  observer: PartialObserver<string>;
  searchResult$: Observable<SearchResult<MovieCriticoned>>;
  private _subject: Subject<string>;

  emptyResult: SearchResult<Movie> = {
    page: 0,
    results: [],
    total_results: 0,
    total_pages: 0
  };

  error = '';
  loading = false;

  constructor(private criticon: Criticon) {}

  ngOnInit(): void {
    this._subject = new Subject<string>();
    this.observer = this._subject;
    this.searchResult$ = this._subject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(_ => {
        this.error = null;
        this.loading = true;
      }),
      switchMap(query => {
        if (query && query !== '') {
          return this.api.search.movies(query);
        } else {
          return this.api.search.movies(query);

          // return of<SearchResult<Movie>>(this.emptyResult);
        }
      }),
      map(searchResult => ({
        ...searchResult,
        results: searchResult.results.map(movie => this.criticon.critic(movie))
      })),
      tap(_ => (this.loading = false))
    );
  }
}
