import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@aws-amplify/auth';

@Component({
  selector: 'voso-disconnect-button',
  templateUrl: './voso-disconnect-button.component.html',
  styleUrls: ['./voso-disconnect-button.component.css']
})
export class VosoDisconnectButtonComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async disconnectFromVosoAndDeso(): Promise<void> {
    try {
      localStorage.removeItem('lastLoggedInUser');
      localStorage.removeItem('identityUsers');
      localStorage.removeItem('mostRecentMessagesTab');
      localStorage.removeItem('lastIdentityServiceURL');
      await Auth.signOut();
      this.rerouteToLandingAfterDisconnect();
      
    } catch (error) {
      console.log('disconnect error :: ', error)
      //TODO: Log error and reroute to error page
    }
  }

  private rerouteToLandingAfterDisconnect() {
    this.router.navigate(['/']);
  }

}
