import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadDirective } from './upload.directive';
import { AvatarBgDirective } from './avatar-bg.directive';

@NgModule({
  declarations: [
    UploadDirective,
    AvatarBgDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UploadDirective,
    AvatarBgDirective
  ]
})
export class AppDirectivesModule { }
