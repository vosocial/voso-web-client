import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/shared/custom-material/custom-material.module';
import { PostFeedComponent } from './post-feed.component';
import { PostFeedDatabinderDirective } from '../providers/post-feed-databinder.directive';

@NgModule({
  declarations: [
    PostFeedComponent,
    PostFeedDatabinderDirective
  ],
  imports: [
    CommonModule,
    CustomMaterialModule
  ],
  exports: [
    PostFeedComponent,
    PostFeedDatabinderDirective
  ]
})
export class PostFeedModule { }
