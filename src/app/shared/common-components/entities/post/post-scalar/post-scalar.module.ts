import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPipesModule } from 'src/app/shared/pipes/app-pipes.module';
import { PostScalarComponent } from './post-scalar.component';
import { PostScalarDatabinderDirective } from './post-scalar-databinder.directive';
import { PostScalarImageComponent } from './post-scalar-image/post-scalar-image.component';
import { PostScalarAvatarComponent } from './post-scalar-avatar/post-scalar-avatar.component';
import { PostScalarBodyComponent } from './post-scalar-body/post-scalar-body.component';
import { PostRepostWrapperComponent } from './post-repost-wrapper/post-repost-wrapper.component';



@NgModule({
  declarations: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent,
    PostScalarAvatarComponent,
    PostScalarBodyComponent,
    PostRepostWrapperComponent
  ],
  imports: [
    CommonModule,
    AppPipesModule
  ],
  exports: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent,
    PostScalarAvatarComponent,
    PostScalarBodyComponent,
    PostRepostWrapperComponent
  ]
})
export class PostScalarModule { }
