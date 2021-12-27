import { Component, 
         OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'voso-connect-button',
  templateUrl: './voso-connect-button.component.html',
  styleUrls: ['./voso-connect-button.component.css']
})
export class VosoConnectButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  navigateFederatedLogin() {
    console.log('auth uri :: ', this.generateLWAUri());
    window.location.href = this.generateLWAUri();
  }

  private generateLWAUri(): string {
    const authData = environment.authData;
    const baseUri: string = 'https://' + authData.AppWebDomain + '/login?';
    const clientId: string = 'client_id=' + authData.UserPoolWebClientId;
    const responseType = '&response_type=code';
    const scope = '&scope=' + authData.TokenScopesArray.join('+');
    const redirectUri = '&redirect_uri=' + authData.RedirectUriSignIn
    return baseUri + clientId + responseType + scope + redirectUri;
  }

}
