import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostScalarComponent } from './post-scalar.component';
import { PostScalarDatabinderDirective } from './post-scalar-databinder.directive';



@NgModule({
  declarations: [
    PostScalarComponent,
    PostScalarDatabinderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PostScalarComponent,
    PostScalarDatabinderDirective
  ]
})
export class PostScalarModule { }
