import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostScalarComponent } from './post-scalar.component';
import { PostScalarDatabinderDirective } from './post-scalar-databinder.directive';
import { PostScalarImageComponent } from './post-scalar-image/post-scalar-image.component';
import { PostScalarAvatarComponent } from './post-scalar-avatar/post-scalar-avatar.component';
import { PostScalarBodyComponent } from './post-scalar-body/post-scalar-body.component';



@NgModule({
  declarations: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent,
    PostScalarAvatarComponent,
    PostScalarBodyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent,
    PostScalarAvatarComponent
  ]
})
export class PostScalarModule { }
