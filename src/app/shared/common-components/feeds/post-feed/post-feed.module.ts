import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostFeedComponent } from './post-feed.component';
import { PostFeedDatabinderDirective } from '../providers/post-feed-databinder.directive';

@NgModule({
  declarations: [
    PostFeedComponent,
    PostFeedDatabinderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PostFeedComponent,
    PostFeedDatabinderDirective
  ]
})
export class PostFeedModule { }
