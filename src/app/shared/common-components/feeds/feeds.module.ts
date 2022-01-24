import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostFeedModule } from './post-feed';



@NgModule({
  imports: [
    CommonModule,
    PostFeedModule
  ],
  exports: [
    PostFeedModule
  ]
})
export class FeedsModule { }
