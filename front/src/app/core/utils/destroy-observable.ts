import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class DestroyObservable implements OnDestroy {

  // Subject use to keep subscription alive until host component is destroyed
  destroy$ = new Subject();

  constructor() { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
