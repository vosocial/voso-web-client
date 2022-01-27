import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTopNavComponent } from './global-top-nav/global-top-nav.component';



@NgModule({
  declarations: [
    GlobalTopNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalTopNavComponent
  ]
})
export class NavModule { }
