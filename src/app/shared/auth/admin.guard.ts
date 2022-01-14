import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, 
         CanActivate, 
         Router, 
         RouterStateSnapshot, 
         UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth, 
         CognitoUser } from '@aws-amplify/auth';
import { CognitoAccessToken,
         CognitoUserSession} from 'amazon-cognito-identity-js';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validateAdministratorStatus();
  }

  /**
   * Overriding DeSo Admin functionality with Cognito Groups
   * This will ignore public keys and only grant admin access to
   * those users in the Cognito Administrators Group
   * 
   * TODO - 1/8/22: We can add an additional check here based on public key as well
   * Instead of checking the IsAdmin status from the GetPostsStateless call,
   * we can check specific public keys from an environment file
   * @returns {Promise<boolean>}
   * @memberof AdminGuard
   */
  validateAdministratorStatus(): Promise<boolean> {

    return new Promise(async (resolve, reject) => {
       try {
        const currentAuthenticatedUser: CognitoUser = await Auth.currentAuthenticatedUser();
        const _session: CognitoUserSession = currentAuthenticatedUser.getSignInUserSession();
        const _token: CognitoAccessToken = _session.getAccessToken();
        const _payload = _token.decodePayload();
        const _groups = _payload['cognito:groups'];
        if (_.indexOf(_groups, 'Administrators') >=0) {
          resolve(true);
        } else {
          // TODO: Privately log unauthorized access if possible
          reject(false);
          this.router.navigateByUrl('');
        }
       } catch (error) {
        console.log('[Authentication Error] ::', error);
        //TODO: Log privately
        reject(false);
        this.router.navigateByUrl(''); // reroute to landing
       }
    })

  }
  
}
