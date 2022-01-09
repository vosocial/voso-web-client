import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router, Scroll, ExtraOptions, PreloadAllModules } from "@angular/router";


import { ViewportScroller } from "@angular/common";
import { filter } from "rxjs/operators";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { DisconnectedPageComponent } from "./disconnected-page/disconnected-page.component";

import { RouteNames } from "./shared/util/route-names/route-names";


const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
  enableTracing: false
}

const routes: Routes = [
  { path: "", component: LandingPageComponent, pathMatch: "full" },
  { path: "signout", component: DisconnectedPageComponent, pathMatch: "full" },
  { path: RouteNames.VOSO_CONNECT, loadChildren: () => import('./features/voso-connect/voso-connect.module').then(m => m.VosoConnectModule) },
  { path: RouteNames.ADMIN, loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
class AppRoutingModule {
  // restore scroll position on navigation
  // we need the 100ms delay because it takes a hot sec to re-render the feed
  // angular doesn't handle scroll resuming correctly: https://github.com/angular/angular/issues/24547
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(filter((e): e is Scroll => e instanceof Scroll)).subscribe((e) => {
      if (e.position) {
        // backward navigation
        setTimeout(() => viewportScroller.scrollToPosition(e.position), 100);
      } else if (e.anchor) {
        // anchor navigation
        setTimeout(() => viewportScroller.scrollToAnchor(e.anchor), 100);
      } else {
        // forward navigation
        setTimeout(() => viewportScroller.scrollToPosition([0, 0]), 100);
      }
    });
  }
}

export { RouteNames, AppRoutingModule };
