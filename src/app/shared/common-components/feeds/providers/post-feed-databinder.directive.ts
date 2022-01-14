import { Directive,
         Output,
         Input,
         OnInit,
         OnDestroy,
         EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { IPost } from '@adonoustech/desoscript-core';
import { PostFeedSingletonService } from './post-feed-singleton.service';
import { FeedPostTypes } from './feed-post-types';

@Directive({
  selector: '[postFeedDatabinder]'
})
export class PostFeedDatabinderDirective implements OnInit, OnDestroy {

  @Input() feedPostType: FeedPostTypes;
  @Input() publicKey: string; // Target public key for posts by public key
  @Output() dataRetrieved: EventEmitter<any> = new EventEmitter;

  dataSubscription: Subscription | undefined;

  debug: boolean = true;

  constructor(private dataService: PostFeedSingletonService) {}

  ngOnInit(): void {
      this.subscribeToData();
      this.fetchData();
  }

  ngOnDestroy(): void {
      this.unsubscribeFromData();
  }

  async fetchData(): Promise<void> {
    this.debug ? console.log('called fetchData') : void 0;
    await this.dataService.fetchData(this.feedPostType, this.publicKey);
  }

  private subscribeToData(): void {
    this.dataSubscription = this.dataService.subscribe(
      {
        next: ((data: IPost[]) => {
          // TODO: Determine filter implementation (if any)
          this.debug ? console.log('subscribed data :: ', data) : void 0;
          this.dataRetrieved.emit(data);
        }),
        error: ((error: string) => {
          this.debug ? console.log('error handling data sub ::', error) : void 0;
          //TODO: handle error
          //TODO: Emit canonical error here
        })
      }
    )
  }

  private unsubscribeFromData(): void {
    this.dataSubscription?.unsubscribe;
  }

}
