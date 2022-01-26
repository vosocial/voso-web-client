import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDesoLayerPublicKeyPostsRequest, 
         IDesoLayerStatelessPostsRequest, 
         IGlobalFeedResponsePayload, 
         IPost } from '@adonoustech/desoscript-core';

import { SharedAuthService } from 'src/app/shared/services/auth/shared-auth.service';
import { PassthroughService } from 'src/app/shared/passthrough';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { BackendApiService } from 'src/app/backend-api.service';
import { FeedPostTypes } from './feed-post-types';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { CanonicalPassthroughRoutes } from '@adonoustech/desoscript-extras';

@Injectable({
  providedIn: 'root'
})
export class PostFeedSingletonService extends BehaviorSubject<IPost[]> {

  posts: IPost[] | undefined;
  max: number = 50;
  debug: boolean = true;

  constructor(private authService: SharedAuthService,
              private passthroughService: PassthroughService,
              private globalVars: GlobalVarsService,
              private backendApi: BackendApiService) {
                super([]);
                this.posts = new Array<IPost>();
               }
  

  /**
   * Fetch the data for the feed. The relevant databinding directive on the feed component is
   * subscribed to this service. This service extends BehaviorSubject. 
   * This makes the service itself an observable, allowing us to simply call "next" when data is
   * available to emit to the databinder.
   * @param {FeedPostTypes} feedPostType
   * @param {string} [publicKey]
   * @returns {Promise<void>}
   * @memberof PostFeedSingletonService
   */
  async fetchData(feedPostType: FeedPostTypes, publicKey?: string): Promise<void> {
    try {
      await this.executeFetch(feedPostType, publicKey);
    } catch (error) {
      // TODO: Handle error globally
      this.debug ? console.log('[ERROR] Post Feed Singleton :: ', error) : null;
    }
  
  }
  
  private async executeFetch(feedPostType: FeedPostTypes, publicKey?: string) {

    let _self = this; // BehaviorSubject
    let _lastPostHashHex: string;

    const vosoUser = await this.authService.userIsAuthenticated();
    const vosoUserSub = vosoUser ? vosoUser.getSignInUserSession().getIdToken().decodePayload()['sub'] : null;

    // Construct the post interface request
    let publicKeyPostsRequestObject: IDesoLayerPublicKeyPostsRequest;
    let statelessPostsRequestObject:  IDesoLayerStatelessPostsRequest;
    feedPostType == FeedPostTypes.PUBLICKEY ? publicKeyPostsRequestObject = this.constructPublicKeyPostsRequest(publicKey, vosoUserSub)
                                           : statelessPostsRequestObject = this.constructStatelessPostsRequest(vosoUserSub);


    let counter: number = 0;

    function _shouldRecurse(instruction: boolean) {
      if (instruction) {
        recurseQuery();
      } else {
        // Before exiting recursion, determine post request type
        // *NOTE* - Posts by public key uses LastPostHashHex while stateless uses PostHashHex 🤷🏾‍♂️
        _lastPostHashHex = '';
        switch (feedPostType) {
          case FeedPostTypes.PUBLICKEY:
            _lastPostHashHex = '';
            publicKeyPostsRequestObject.payload.LastPostHashHex = _lastPostHashHex;
            break;
          case FeedPostTypes.STATELESS:
            _lastPostHashHex = '';
            statelessPostsRequestObject.payload.PostHashHex = _lastPostHashHex;            
            break;
        }
        
      }
    }

    async function recurseQuery() {
      try {
        const _fetched: IPost[] = await _executePromise();
        if (_fetched && counter <= _self.max) {
          if (_fetched.length > 0) {
              // emit posts to subscribers
              _self.next(_fetched);
              const _last: IPost = _.last(_fetched);
              _lastPostHashHex = _last.PostHashHex;

              console.log('updated _lastPostHashHex :: ', _lastPostHashHex);

              // During recursion, determine original posts request type before
              // updating the _lastPostHashHex
              // *NOTE* - Posts by public key uses LastPostHashHex while stateless uses PostHashHex 🤷🏾‍♂️
              switch (feedPostType) {
                case FeedPostTypes.PUBLICKEY:
                  publicKeyPostsRequestObject.payload.LastPostHashHex = _lastPostHashHex;
                  break;
                case FeedPostTypes.STATELESS:
                  statelessPostsRequestObject.payload.PostHashHex = _lastPostHashHex;            
                  break;
              }

              // increment counter
              counter = counter + 50;

              _shouldRecurse(true);
          }
        } else {
          // End recursion
          _shouldRecurse(false);
        }
        //console.log('_fetched :: ', _fetched);
      } catch (error) {
        // end recursion
        console.error('Error during recursion ::', error);
        _shouldRecurse(false);
      }
    }

    /**
     * Hitting pub endpoint - 1/24/22
     * Hits interceptor (clout-api-interceptor-dev-cloutapiinterceptor5A0D1-36myXU6opgRN)
     * @returns {Promise<IPost[]>}
     */
    function _executePromise(): Promise<IPost[]> {
      // Return as many incremental promises as necessary
      return new Promise(async (resolve, reject) => {
          // make call
          try {
            console.log('making new stateless call with ', statelessPostsRequestObject);

            const response = await _self.passthroughService
                                        .passthrough(feedPostType == FeedPostTypes.PUBLICKEY ? publicKeyPostsRequestObject 
                                                                                             : statelessPostsRequestObject, 
                                                                                              CanonicalPassthroughRoutes.CLOUT, null, null, true);
            const parsedFeedResponse: IGlobalFeedResponsePayload = JSON.parse(response);
            _self.debug ? console.log('parsedFeedResponse :: ', parsedFeedResponse) : void 0;
            
            feedPostType === FeedPostTypes.PUBLICKEY ? resolve(<IPost[]> parsedFeedResponse.Posts)
                                                          : resolve(<IPost[]> parsedFeedResponse.PostsFound)
            
          } catch (error) {
            // error processed up-stream
            reject(error);
          }
      })
    }

    // Start
    recurseQuery();

  }

  /**
   *
   *
   * @private
   * @param {string} publicKey
   * @returns {IDesoLayerPublicKeyPostsRequest}
   * @memberof PostFeedSingletonService
   */
  private constructPublicKeyPostsRequest(publicKey: string, userSub?: string): IDesoLayerPublicKeyPostsRequest {

    let obj;

    obj = {
      userSub: userSub,
      instruction: 'posts-public-key',
      payload: {
        Username: '',
        PublicKeyBase58Check: publicKey,
        ReaderPublicKeyBase58Check: this.backendApi.GetStorage(this.backendApi.LastLoggedInUserKey) ? this.backendApi.GetStorage(this.backendApi.LastLoggedInUserKey) 
                                                                                                    : environment.admin.defaultReaderKey,
        NumToFetch: 50
      }
    };

    return obj;

  }

  private constructStatelessPostsRequest(userSub?: string): IDesoLayerStatelessPostsRequest {

    let obj;
    
    obj = {
      userSub: userSub,
      instruction: 'posts-stateless',
      payload: {
        PostHashHex: '',
        ReaderPublicKeyBase58Check: this.backendApi.GetStorage(this.backendApi.LastLoggedInUserKey) ? this.backendApi.GetStorage(this.backendApi.LastLoggedInUserKey) 
                                                                                                    : environment.admin.defaultReaderKey,
        OrderBy:"newest",
        StartTstampSecs:0,
        PostContent:"",
        NumToFetch:50,
        FetchSubcomments:false,
        GetPostsForFollowFeed:false,
        GetPostsForGlobalWhitelist:false,
        GetPostsByDESO:false,
        MediaRequired:false,
        PostsByDESOMinutesLookback:0,
        AddGlobalFeedBool:true
      }
    }

    return obj;

  }

}
