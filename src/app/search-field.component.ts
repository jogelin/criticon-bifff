import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PartialObserver } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

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
    // setTimeout(() => this.control.setValue('Taxman'), 300);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
