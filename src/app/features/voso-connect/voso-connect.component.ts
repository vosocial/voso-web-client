import { Component, 
         OnInit,
         OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUser,
         Auth } from '@aws-amplify/auth';
import { SharedAuthService } from 'src/app/shared/services/auth/shared-auth.service';
import { BackendApiService } from 'src/app/backend-api.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { MenuDropDownAnimation } from 'src/app/shared/animations';
import { environment } from 'src/environments/environment';
import { IDataLayerInterceptorRequest } from '@adonoustech/desoscript-aws';
import { CanonicalDLIInstructions, CanonicalPassthroughRoutes } from '@adonoustech/desoscript-extras';
import { IStoreableUser } from 'src/app/shared/passthrough';
import { PassthroughService } from 'src/app/shared/passthrough';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

@Component({
  selector: 'app-voso-connect',
  templateUrl: './voso-connect.component.html',
  styleUrls: ['./voso-connect.component.css'],
  animations: [ MenuDropDownAnimation ]
})
export class VosoConnectComponent implements OnInit, OnDestroy {

  userToken: CognitoUser | undefined;
  vosoUser: CognitoUser | undefined;
  storableUser: IStoreableUser | undefined;

  dropdownMenuState: 'show' | 'hide' | undefined;
  avatarSourceUri: string;
  activeUserName: string;


  constructor(private globalVars: GlobalVarsService,
              private api: BackendApiService,
              private authService: SharedAuthService,
              private router: Router,
              private passthroughService: PassthroughService) { 
    this.dropdownMenuState = 'hide';
    if (this.globalVars.loggedInUser) {
      console.info('[INFO] - DeSo User is present');
      this.initiateDeSoUser();
    } else {
      console.error('[NO DeSo User Present]');
      // If no DeSo user present, reroute to landing
      this.router.navigate(['/']);
    }

  }

  async ngOnInit(): Promise<void> {
    try {

      // initialize cognito hub subscription
      this.initCognito();

    } catch (error) {
      console.error('[User not authenticated] :: ', error);
      /**
       * Do nothing here as user will need to explicitly request
       * connection to VoSo application. When that happens, voso-connect
       * will run ngOnInit again, and pick up the authenticated user (Cognito).
      */
    }

  }

  /**
   *
   *TODO: Implement
   * @memberof VosoConnectComponent
   */
  ngOnDestroy() {}

  toggleDropDownMenuState() {
    this.dropdownMenuState == 'hide' ? this.dropdownMenuState = 'show' : this.dropdownMenuState = 'hide';
  }

  private initiateDeSoUser(): void {
    this.avatarSourceUri = this.api.GetSingleProfilePictureURL(environment.node.url, 
      this.globalVars.loggedInUser.PublicKeyBase58Check, 
      environment.node.profile_pic_fallback);

    this.activeUserName = this.globalVars.loggedInUser.ProfileEntryResponse.Username;
  }

  private async initCognito(): Promise<void> {

    try {
      console.info('[AUTH] :: Hit signin event');
      this.userToken = await this.authService.userIsAuthenticated();
      console.info("[AUTH SIGNIN EVENT] :: ", this.userToken);

      //TODO: Build storable user
      this.storableUser = {
        id: this.userToken.getSignInUserSession().getIdToken().decodePayload()['sub'],
        canonicalUserName: this.userToken.getUsername(),
        desoUserName: this.globalVars.loggedInUser.ProfileEntryResponse.Username,
        desoPublicKeyBase58Check: this.globalVars.loggedInUser.PublicKeyBase58Check
      };

      //TODO: Conditionally add storableUser to DB
      try {
        await this.conditionallyAddDeSoUserToDB();
        console.log('[INFO] :: Added IStorableUser to DB', this.storableUser);
      } catch (error) {
        console.error('[ERROR] :: Failed to add IStorableUser to DB', error);
        //TODO: Log error globally
      }


    } catch (error) {
      //TODO: This is a fatal error. There should be an accessible
      // cognito user here.
      //TODO: Emit this to the global error service
      console.error('[ERROR] - Could not retrieve cognito user...');
    }


    this.vosoUser = await this.authService.userIsAuthenticated();
    console.log(this.globalVars.loggedInUser);
    console.log(this.vosoUser);

    // TODO: When voso-connect detects a valid user, invoke the
  }

  private conditionallyAddDeSoUserToDB(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Construct the DLI
      // Backend will automatically ignore conditional errors
      const dli: IDataLayerInterceptorRequest = {
        Instruction: CanonicalDLIInstructions.PUT,
        QueryParams: {
          TableName: environment.system.dbTableName,
          Item: this.storableUser as any, 
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'id'
          }
        }
      };

      // make call to passthrough
      try {
        await this.passthroughService.passthrough(dli, CanonicalPassthroughRoutes.DATAREQUEST);
        resolve();
      } catch (error) {
        reject(error);
      }

    })
  }

}
