import { Directive,
         Output,
         Input,
         OnInit,
         OnDestroy,
         EventEmitter } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { fromEvent, interval } from 'rxjs';
import { bufferCount } from 'rxjs/operators'
import * as _ from 'lodash';
import { IPost } from '@adonoustech/desoscript-core';
import { PostFeedSingletonService } from './post-feed-singleton.service';
import { FeedPostTypes } from './feed-post-types';
import { PostFeedComponent } from '../post-feed/post-feed.component';

@Directive({
  selector: '[postFeedDatabinder]'
})
export class PostFeedDatabinderDirective implements OnInit, OnDestroy {

  @Input() feedPostType: FeedPostTypes;
  @Input() publicKey: string; // Target public key for posts by public key
  @Output() dataRetrieved: EventEmitter<any> = new EventEmitter;

  dataSubscription: Subscription | undefined;
  masterDataFeed: IPost[];

  debug: boolean = true;

  constructor(private dataService: PostFeedSingletonService) {
    this.masterDataFeed = new Array<IPost>();
  }

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
    this.dataSubscription = this.dataService
                                .pipe()
                                .subscribe(
      {
        next: ((data: IPost[]) => {
          _.map(data, (d: IPost) => {
            this.masterDataFeed.push(d);
          });
          this.debug ? console.log('this.masterDataFeed :: ', this.masterDataFeed) : void 0;
          this.dataRetrieved.emit(this.masterDataFeed);
        })
      }
    );
  }

  private unsubscribeFromData(): void {
    this.dataSubscription?.unsubscribe;
  }

}
