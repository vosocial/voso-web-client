import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostScalarComponent } from './post-scalar.component';
import { PostScalarDatabinderDirective } from './post-scalar-databinder.directive';
import { PostScalarImageComponent } from './post-scalar-image/post-scalar-image.component';



@NgModule({
  declarations: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PostScalarComponent,
    PostScalarDatabinderDirective,
    PostScalarImageComponent
  ]
})
export class PostScalarModule { }
