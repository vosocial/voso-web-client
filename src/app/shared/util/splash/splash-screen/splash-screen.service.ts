import { Injectable,
         Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
providedIn: 'root'
})
export class SplashScreenService {

constructor(
@Inject(DOCUMENT) private _document: any,
private _router: Router
) {
console.log('constructed:: ');
// Hide on first NavigationEnd event
this._router.events
 .pipe(
   filter(event => event instanceof NavigationEnd),
   take(1)
 )
 .subscribe(() => {
   console.log('call hide ??');
   this.hide();
 })
}

show(): void {
this._document.body.classList.remove('splash-screen-hidden');
}

hide(): void {
this._document.body.classList.add('splash-screen-hidden');
}
}

