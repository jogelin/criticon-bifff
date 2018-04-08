import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { PartialObserver } from 'rxjs/Observer';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Movie, SearchResult, TmdbApi } from 'tmdb-typescript-api';

import { MovieCriticoned } from './criticon.model';
import { Criticon } from './criticon.service';


@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="mat-elevation-z1 fixed top-0 left-0 z2">
      <app-search-field class="flex-auto" [loading]="loading" [observer]="observer"></app-search-field>
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
    }
  `
  ]
})
export class AppComponent implements OnInit {
  api: TmdbApi = new TmdbApi('b35c3bc9289e42e0ee2a52a8e4216320');

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
          return of(this.emptyResult);
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
