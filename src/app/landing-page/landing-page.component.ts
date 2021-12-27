import { Component, OnInit } from "@angular/core";
import { GlobalVarsService } from "../global-vars.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  
  constructor(public globalVars: GlobalVarsService, 
              private router: Router) {}

  ngOnInit() {
    if (!this.globalVars.showLandingPage()) {
      this.router.navigate(["/" + this.globalVars.RouteNames.VOSO_CONNECT], { queryParamsHandling: "merge" });
    }
  }

  initiateAuth(): void {
    this.globalVars.launchSignupFlow();
  }
}
