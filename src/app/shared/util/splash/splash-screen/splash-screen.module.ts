import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenService } from './splash-screen.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SplashScreenModule {
  // This is more of a hack. Although service injected in root, still need to inject here
  // in the module, otherwise splash doesn't work
  constructor(private _splashScreenService: SplashScreenService) {}
}
