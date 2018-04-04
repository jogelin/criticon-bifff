import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {concatMap, debounceTime, distinctUntilChanged, map, mergeMap, startWith, switchMap, switchMapTo} from "rxjs/operators";
import {Movie, search, SearchResult, SearchResults} from "imdb-api";
import {from} from "rxjs/observable/from";

@Component({
  selector: 'app-root',
  template: `
    <mat-card>
      <form>
        <mat-form-field [style.width]="'50%'">
          <input matInput placeholder="Movie" aria-label="Movie" [matAutocomplete]="auto" [formControl]="control">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let movie of movies$ | async" [value]="movie">
              <div>
                <img style="vertical-align:middle;" aria-hidden src="{{movie.poster}}" height="25"/>
                <span>{{ movie.title }}</span>
                <small>({{movie.year}})</small>
              </div>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </form>
    </mat-card>
  `,
  styles: [`
    
  `]
})
export class AppComponent {
  control: FormControl;
  movies$: Observable<SearchResult[]>;

  constructor() {
    this.control = new FormControl();
    this.movies$ = this.control.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        mergeMap((value: string) => from(
            search({title: value}, {apiKey: '126d66f3', timeout: 30000})
          )
        ),
        map((searchResults: SearchResults) => searchResults.results)
      );
  }

}
