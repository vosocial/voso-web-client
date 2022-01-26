import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPipesModule } from '../../pipes/app-pipes.module';
import { PostFeedModule } from './post-feed';



@NgModule({
  imports: [
    CommonModule,
    AppPipesModule,
    PostFeedModule
  ],
  exports: [
    PostFeedModule
  ]
})
export class FeedsModule { }
