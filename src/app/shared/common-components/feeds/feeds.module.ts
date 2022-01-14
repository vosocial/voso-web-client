import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from '../../custom-material/custom-material.module';
import { PostFeedModule } from './post-feed';



@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    PostFeedModule
  ],
  exports: [
    PostFeedModule
  ]
})
export class FeedsModule { }
