import { Injectable } from '@angular/core';
import { Subject,
         Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedErrorDisplayService {

  // observable source
  private errorSource = new Subject<string>();

  // observable stream
  errorSource$: Observable<string> = this.errorSource.asObservable();

  /**
   * Emits error globally. Error display handled at central location
   * in app component.
   * @param {string} error
   * @memberof SharedErrorDisplayService
   */
     public emitError(error: string) {
      this.errorSource.next(error);
  }

}
