import { Component, OnInit } from '@angular/core';
import { GlobalVarsService } from '../global-vars.service';

@Component({
  selector: 'app-disconnected-page',
  templateUrl: './disconnected-page.component.html',
  styleUrls: ['./disconnected-page.component.css']
})
export class DisconnectedPageComponent implements OnInit {

  constructor(private globalVars: GlobalVarsService) { }

  ngOnInit(): void {
  }

  initiateAuth(): void {
    this.globalVars.launchSignupFlow();
  }

}
