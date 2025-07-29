import { Injectable } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(
    observeOn(asyncScheduler)
  );

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
