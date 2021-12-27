import { Component, 
         OnInit,
         OnChanges,
         Input } from '@angular/core';
import { CognitoUser } from '@aws-amplify/auth';
import { SharedAuthService } from '../../services/auth/shared-auth.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { CanonicalCLIInstructions, 
         CanonicalDLIInstructions, 
         CanonicalPassthroughRoutes } from '@adonoustech/desoscript-extras';
import { IDataLayerInterceptorRequest } from '@adonoustech/desoscript-aws';
import { environment } from 'src/environments/environment';
import { PassthroughService } from '../../passthrough';

@Component({
  selector: 'voso-connect-status',
  templateUrl: './voso-connect-status.component.html',
  styleUrls: ['./voso-connect-status.component.css']
})
export class VosoConnectStatusComponent implements OnInit, OnChanges {

  @Input() vosoUser: CognitoUser | undefined;

  vosoConnectionValid: boolean;
  validatingVosoConnection: boolean;

  constructor(private auth: SharedAuthService,
              private globalVars: GlobalVarsService,
              private passthroughService: PassthroughService) {
                this.validatingVosoConnection = true;
              }

  async ngOnInit(): Promise<void> {
  }

  async ngOnChanges(): Promise<void> {
    console.log('this.vosoUser :: ', this.vosoUser);
    /**
     * TODO: Verify user has valid entry in DB before validating connection
    */
   if (this.vosoUser) {
    try {
      await this.checkVoSoUserInDB();
      this.vosoConnectionValid = true;
      this.validatingVosoConnection = false;
     } catch (error) {
       console.error('[ERROR] - VoSo User not present in DB', error);
       this.vosoConnectionValid = false;
       this.validatingVosoConnection = false;
     }
   } else {
      this.vosoConnectionValid = false;
      this.validatingVosoConnection = false;
     console.log('no voso user to check', this.vosoUser);
   }

  }

  private checkVoSoUserInDB(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // construct DLI request
      const dli: IDataLayerInterceptorRequest = {
        Instruction: CanonicalDLIInstructions.QUERY,
        QueryParams: {
          TableName: environment.system.dbTableName,
          KeyConditionExpression: '#id = :id',
          ExpressionAttributeNames: {
            '#id': 'id',
          },
          ExpressionAttributeValues: {
            ':id': this.vosoUser.getSignInUserSession().getIdToken().decodePayload()['sub']
          }
        }
      };

      try {
        const queryResponse: string = await this.passthroughService.passthrough(dli, CanonicalPassthroughRoutes.DATAREQUEST);
        console.log('queryResponse :: ', queryResponse);
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  }

}
