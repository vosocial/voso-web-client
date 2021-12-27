import { Injectable } from '@angular/core';
import { Subject,
         Observable,
         Subscription } from 'rxjs';
import { BreakpointObserver,
         Breakpoints } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { IViewport } from '../util/viewport';

@Injectable({
  providedIn: 'root'
})
export class SharedViewportService extends Subject<IViewport> {

  viewportHandsetSubscription: Subscription | undefined;
  viewportTabletSubscription: Subscription | undefined;
  viewportWebSubscription: Subscription | undefined;

  viewportReport: IViewport | undefined;

  // This is an observable boolean source for the initial viewport evaluation as well
  // as the observable stream. This is a recommended approach to emitting a value as an observable from
  // a service.
  //
  // see https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
  private initialViewportEvalSource = new Subject<IViewport>();
  initialViewportEvalSource$: Observable<IViewport> = this.initialViewportEvalSource.asObservable();

  constructor(private breakPointObserver: BreakpointObserver,
              private ruler: ViewportRuler) { 
                super();

                    // subscribe internally within this service to viewport observer
                    // viewport observer will emit to all subscribers throughout the app as long as they inject
                    // this service
                    this.subscribeRealtimeViewportObservers();
  }

   /**
   * Provides the initial viewport data. This is useful for obtaining viewport data and making layout
   * decisions before the breakpoint observer fires. The breakpoint observer only fires after a resize
   * event is triggered. This is publically callable.
   * @memberof SharedViewportService
   */
     public emitInitialViewportStatus() {
      this.initialViewportEvalSource.next(this.evaluateRawViewport(this.ruler.getViewportSize()['width']));
    }

  /**
   * Starts subscription to breakPointObserver. When a resize event happens, breakPointObserver
   * calls "next" on the underlying implementation of Subject. This service extends Subject so 
   * the "next" method on the underlying implementation can be called via Super.
   * @private
   * @memberof SharedViewportService
   */
   private subscribeRealtimeViewportObservers() {

    // handset query
    this.viewportHandsetSubscription = this.breakPointObserver.observe([Breakpoints.Handset]).subscribe({
      next: (result) => {
        if (result.matches) {
          this.viewportReport = {
            isWeb: false,
            isTablet: false,
            isHandset: true
          }
          super.next(this.viewportReport);
        }
      }
    }); 
    
    // tablet query
    this.viewportTabletSubscription = this.breakPointObserver.observe([Breakpoints.Tablet]).subscribe({
      next: (result) => {
        if (result.matches) {
          this.viewportReport = {
            isWeb: false,
            isTablet: true,
            isHandset: false
          }
          super.next(this.viewportReport);
        }
      }
    }); 

    // web query
    this.viewportWebSubscription = this.breakPointObserver.observe([Breakpoints.Web]).subscribe({
      next: (result) => {
        if (result.matches) {
          this.viewportReport = {
            isWeb: true,
            isTablet: false,
            isHandset: false
          }
          super.next(this.viewportReport);
        }
      }
    });

  }

  /**
   * Utility method for evaluating the raw viewport dimensions.
   * @private
   * @param {number} viewportWidth
   * @returns {boolean}
   * @memberof SharedViewportService
   */
   private evaluateRawViewport(viewportWidth: number): IViewport {
    let viewportReport: IViewport;

    if ((viewportWidth <= 576 )) {
      viewportReport = {
        isHandset: true,
        isTablet: false,
        isWeb: false
      }
    } else if ((viewportWidth > 576 && viewportWidth <= 720)) {
      viewportReport = {
        isHandset: false,
        isTablet: true,
        isWeb: false
      }
    } else {
      viewportReport = {
        isHandset: false,
        isTablet: false,
        isWeb: true
      }
    }

    return viewportReport;

  }  

}
