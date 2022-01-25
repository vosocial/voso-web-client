import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDesoLayerSinglePostRequest,
         IGetSinglePostResponsePayload,
         IPost } from '@adonoustech/desoscript-core';
import { SharedAuthService } from 'src/app/shared/services/auth/shared-auth.service';
import { PassthroughService } from 'src/app/shared/passthrough';
import { CanonicalPassthroughRoutes } from '@adonoustech/desoscript-extras';

@Injectable({
  providedIn: 'root'
})
export class PostScalarDataService extends BehaviorSubject<IPost> {

  debug: boolean = true;

  constructor(private authService: SharedAuthService,
              private passthroughService: PassthroughService) { 
                super(undefined);
              }
  
  async fetchData(postHash: string, readerKey: string): Promise<void> {
    try {
      await this.executeFetch(postHash, readerKey);
    } catch (error) {
      //TODO: Handle error globally
    }
  }

  private async executeFetch(postHash: string, readerKey: string): Promise<void> {
    const vosoUser = await this.authService.userIsAuthenticated();
    const vosoUserSub = vosoUser ? vosoUser.getSignInUserSession().getIdToken().decodePayload()['sub'] : null;

    // Construct the post interface request
    const singlePostRequestWrapper: IDesoLayerSinglePostRequest = {
      userSub: vosoUserSub,
      instruction: 'single-post',
      payload: { //IGetSinglePostRequestPayload
        AddGlobalFeedBool: true,
        CommentLimit: 20,
        CommentOffset: 0,
        FetchParents: true,
        PostHashHex: postHash,
        ReaderPublicKeyBase58Check: readerKey
      }
    };

    try {
      const response = await this.passthroughService
                                 .passthrough(singlePostRequestWrapper, 
                                              CanonicalPassthroughRoutes.CLOUT, null, null, true);
      const parsedResponse: IGetSinglePostResponsePayload = JSON.parse(response);
      this.debug ? console.log('response :: ', parsedResponse) : void 0;
      
      // Emit
      this.next(parsedResponse.PostFound);

    } catch (error) {
      this.debug ? console.error('[ERROR] Post Scalar Svc :: ', error) : void 0;
      throw new Error(error);
    }
  }
  
}
