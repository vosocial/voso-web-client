// core modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";

// shared modules
import { AppDirectivesModule } from "./shared/directives/app-directives.module";
import { AppPipesModule } from "./shared/pipes/app-pipes.module";
import { SplashScreenModule } from "./shared/util/splash/splash-screen/splash-screen.module";

// main components
import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { DisconnectedPageComponent } from './disconnected-page/disconnected-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DisconnectedPageComponent
  ],
  imports: [
    AppDirectivesModule,
    AppPipesModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SplashScreenModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
