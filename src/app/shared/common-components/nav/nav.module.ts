import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTopNavComponent } from './global-top-nav/global-top-nav.component';
import { GlobalMobileNavComponent } from './global-mobile-nav/global-mobile-nav.component';



@NgModule({
  declarations: [
    GlobalTopNavComponent,
    GlobalMobileNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalTopNavComponent
  ]
})
export class NavModule { }
