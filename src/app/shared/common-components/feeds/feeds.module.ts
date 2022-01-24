import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostFeedModule } from './post-feed';
import { PostScalarModule } from '../entities/post/post-scalar';



@NgModule({
  imports: [
    CommonModule,
    PostFeedModule,
    PostScalarModule
  ],
  exports: [
    PostFeedModule
  ]
})
export class FeedsModule { }
