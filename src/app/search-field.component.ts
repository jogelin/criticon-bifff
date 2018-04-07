import { ChangeDetectorRef, Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  map,
  switchMap,
  tap,
  switchMapTo
} from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'events';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/Observer';

@Component({
  selector: 'app-search-field',
  template: `
    <mat-form-field>
      <input matInput placeholder="What is your favorite movie ?" [formControl]="control" required>
      <mat-icon *ngIf="control.value" matSuffix (click)="control.reset()">close</mat-icon>
    </mat-form-field>
  `,
  styles: [
    `
    .mat-form-field {
      width: 100%;
    }

    .mat-icon {
      cursor:pointer;
      font-size: 24px;
    }
  `
  ]
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  control = new FormControl();
  private _subscription: Subscription;

  @Input() loading = false;
  @Input() public observer: PartialObserver<string>;

  ngOnInit(): void {
    this._subscription = this.control.valueChanges.subscribe(this.observer);
    setTimeout(() => this.control.setValue('without title'), 300);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
