import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  startWith,
  switchMap,
  switchMapTo,
  tap,
  catchError
} from 'rxjs/operators';
import { Movie, search, SearchResult, SearchResults } from 'imdb-api';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="mat-elevation-z2">
      <mat-toolbar-row>
        <mat-form-field>
          <input matInput placeholder="What is your favorite movie ?" [matAutocomplete]="auto" [formControl]="control" required>
          <mat-error *ngIf="error">{{error}}</mat-error>
          <mat-autocomplete #auto="matAutocomplete"  [displayWith]="displayFn">
            <mat-option *ngFor="let movie of movies$ | async" [value]="movie">
              <div>
                <img *ngIf="movie.poster !== 'N/A'" style="vertical-align:middle;" aria-hidden src="{{movie.poster}}" width="30"/>
                <mat-icon *ngIf="movie.poster === 'N/A'">movie</mat-icon>
                <span>{{ movie.title }}</span>
                <small>({{movie.year}})</small>
              </div>
            </mat-option>
            <mat-progress-bar *ngIf="loading" mode="query"></mat-progress-bar>
          </mat-autocomplete>
          <mat-icon *ngIf="control.value" matSuffix (click)="control.reset()">close</mat-icon>
        </mat-form-field>
      </mat-toolbar-row>
    </mat-toolbar>

    <mat-card *ngIf="control.value && control.value !== '' && control.value.title">
      <mat-card-header>
        <img mat-card-avatar style="vertical-align:middle;" aria-hidden src="{{control.value.poster}}" height="25"/>
        <mat-card-title>{{ control.value.title }}</mat-card-title>
        <mat-card-subtitle>{{control.value.year}}</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
    {{error}}
    {{control.value | json}}
    {{movies$ | async | json}}

  `,
  styles: [
    `
    .mat-toolbar-row {
      height:96px;
    }

    .mat-form-field {
      width: 100%;
    }

    .mat-icon {
      cursor:pointer;
      font-size: 24px;
    }

    .mat-card-title {
      font-size: 24px;
      margin-bottom: 8px;
    }
  `
  ]
})
export class AppComponent {
  control: FormControl;
  movies$: Observable<SearchResult[]>;

  error = '';
  loading = false;

  constructor(private cd: ChangeDetectorRef) {
    this.control = new FormControl();
    this.movies$ = this.control.valueChanges.pipe(
      debounceTime(300),
      tap(_ => this.error = null),
      tap(_ => this.loading = true),
      switchMap((value: string) => {
        if (value && value.length > 1) {
          return from(search({ title: value }, { apiKey: '126d66f3', timeout: 30000 })).pipe(
            map((searchResults: SearchResults) => searchResults.results)
          );
        } else {
          return of([]);
        }
      }),
      tap(_ => this.loading = false),
      catchError(error => {
        this.error = error.message;
        return of([]);
      }),
      tap(_ => this.cd.markForCheck),
      tap(_ => this.cd.detectChanges),
    );
  }

  displayFn(movie: Movie) {
    return movie ? movie.title : movie;
  }
}
