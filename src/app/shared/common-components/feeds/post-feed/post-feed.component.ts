import { Component, 
         OnInit,
         Input } from '@angular/core';
import { IPost, IUser } from '@adonoustech/desoscript-core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { FeedShell } from '../providers/feed-shell';
import { ISponsorship } from '../providers/i-sponsorship';
import { FeedPostTypes } from '../providers/feed-post-types';

@Component({
  selector: 'post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent extends FeedShell implements OnInit {

  // Inherited
  desoUser: IUser;
  vosoUser: CognitoUser;
  data: IPost[];
  initializing: boolean;
  working: boolean;

  // Extend
  @Input() feedPostType: FeedPostTypes;
  @Input() publicKey: string; // Public key to target for post by pub key

  debug: boolean = true;


  constructor() { 
    super();
  }

  ngOnInit(): void {
    console.log('this.data ::', this.data);
  }

  onDataRetrieved(data: IPost[]) {

    this.data = [].concat(data);
    this.debug ? console.log('[this.data fron databinder] :: ', this.data) : void 0;
  }

}
