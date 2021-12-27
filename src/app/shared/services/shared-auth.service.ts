import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@aws-amplify/auth';
import { CognitoUserSession,
         CognitoUser } from 'amazon-cognito-identity-js';
import { ICognitoIdTokenPayload, IDataLayerInterceptorRequest } from '@adonoustech/cloutscript-aws';
import { PassthroughService } from './passthrough/passthrough.service';
import { CanonicalDLIInstructions, CanonicalPassthroughErrors, CanonicalPassthroughRoutes } from '@adonoustech/cloutscript-extras';
import { environment } from '../../../environments/environment';
import { PassthroughRoutes } from './passthrough/passthrough-routes';
import { QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { IBitCloutIdentityUsersObject } from '@adonoustech/cloutscript-core';
import { BitcloutIdentityService,
         BitcloutBackendApiHelperService } from '.';

@Injectable({
  providedIn: 'root'
})
export class SharedAuthService {

  constructor(private router: Router,
              private passthrough: PassthroughService,
              private bcIdentityService: BitcloutIdentityService,
              private bcBackendApiService: BitcloutBackendApiHelperService) { }

  /**
   * Retrieve and return the Id token. This is the token used when
   * a bearer token is required.
   * @returns {Promise<string>}
   * @memberof SharedAuthService
   */
  static getIdTokenPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      Auth.currentSession().then(
        (response: CognitoUserSession) => {
          resolve(response.getIdToken().getJwtToken());
        },
        (err: Error) => {
          reject(err);
        }
      ).catch((err) => {
        reject(err);
      });
    });
  }

  static getUserForLoggingAndTrace(): Promise<ICognitoIdTokenPayload> {
    return new Promise((resolve, reject) => {
      Auth.currentSession().then( async (session) => {
        const tokenPayload: ICognitoIdTokenPayload = <ICognitoIdTokenPayload>session.getIdToken()['payload'];
        resolve(tokenPayload);
      },
      (error) => { reject(error); });
    });
  }

  /**
   *
   * Retrieve and return the refresh token
   * @returns {Promise<string>}
   * @memberof SharedAuthService
   */
  getRefreshTokenPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      Auth.currentSession().then(
        (session: CognitoUserSession) => {
          resolve(session.getRefreshToken().getToken());
        },
        (err: Error) => {
          reject(err);
        }
      ).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Determine whether user is authenticated. If the user is authenticated,
   * return the user in the response
   * @returns {(Promise<boolean | CognitoUser>)}
   * @memberof SharedAuthService
   */
  userIsAuthenticated(): Promise<undefined | CognitoUser> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser().then(
        (AuthCurrentAuthenticatedUserResponse: CognitoUser) => {
          resolve(AuthCurrentAuthenticatedUserResponse);
        },
        (AuthCurrentAuthenticatedUserError: Error) => {
          reject(AuthCurrentAuthenticatedUserError);
        }
      );
    });
  }

  setAuthenticatedUser(): Promise<CognitoUser> {
    return new Promise((resolve, reject) => {
      this.userIsAuthenticated().then(
        (userToken) => {
          resolve(<CognitoUser>userToken);
        }
      ).catch(
        (error) => {
          // route user to auth
          //console.error('[Auth] - User is not authenticated, reroute to sign-in');
          reject(error);
          this.router.navigate(['/sign-in']);
        }
      );
    });
  }

  checkBitCloutIdentityExistence(userToken: CognitoUser): Promise<IBitCloutIdentityUsersObject> {
    return new Promise(async (resolve, reject) => {

      // construct BLI request
      const dli: IDataLayerInterceptorRequest = {
        Instruction: CanonicalDLIInstructions.QUERY,
        QueryParams: {
          TableName: environment.system.dbTableName,
          KeyConditionExpression: '#sb = :sub',
          ExpressionAttributeNames: {
            '#sb': 'sub',
            '#bc': 'bitclout'
          },
          ProjectionExpression: '#bc',
          ExpressionAttributeValues: {
            ':sub': userToken?.getSignInUserSession()?.getIdToken().decodePayload()['sub']
          }
        }
      };

      try {
        const queryResponse: string = await this.passthrough.passthrough(dli, PassthroughRoutes.DATAREQUEST);
        try {
          const parsedBCIdentity: QueryCommandOutput = JSON.parse(<string> queryResponse);
          const bitCloutIdentity = parsedBCIdentity.Items ? parsedBCIdentity.Items[0]['bitclout'] as any : null;
          resolve(bitCloutIdentity);
        } catch (error) {
          // If error on checking BC identity, launch the login flow from BC Identity Service
          this.launchLoginFlow(userToken);
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private launchLoginFlow(userToken: CognitoUser) { // TODO: Refactor this. Notice accesslevelrequest is hardcoded to 3
    //this.logEvent('account : login : launch');
    this.bcIdentityService.launch('/log-in?accessLevelRequest=3').subscribe(async (res) => {
      //console.log('identity service launch res :: ', res);
      try {
        this.bcBackendApiService.setIdentityServiceUsers(res.users, Object.keys(res.users)[0]);
        await this.writeBitCloutIdentityToDB(userToken, res);
        //console.log('successfully wrote bitclout identity to db');
      } catch (error) {
        //console.error('Error writing bitclout identity to DB');
      }
    });
  }

  private writeBitCloutIdentityToDB(userToken: CognitoUser, bcIdentity: IBitCloutIdentityUsersObject): Promise<void> {
    return new Promise(async (resolve, reject) => {

      const dli:  IDataLayerInterceptorRequest = {
        Instruction: CanonicalDLIInstructions.UPDATE,
        QueryParams: {
          TableName: environment.system.dbTableName,
          Key: {sub: userToken?.getSignInUserSession()?.getIdToken().decodePayload()['sub']},
          UpdateExpression: 'set #bc = :bitclout',
          ExpressionAttributeNames: {
            '#bc': 'bitclout'
          },
          ExpressionAttributeValues: {
            ':bitclout': bcIdentity as any
          }
        }
      };

      try {
        await this.passthrough.passthrough(dli, CanonicalPassthroughRoutes.DATAREQUEST);
        resolve();
      } catch (error) {
        reject(error);
      }

    });
  }

}
