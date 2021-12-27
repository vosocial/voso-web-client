import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanitizeAndAutoLinkPipe } from './sanitize-and-auto-link-pipe';
import { SanitizeEmbedPipe } from './sanitize-embed-pipe';
import { SanitizeQRCodePipe } from './sanitize-qrcode-pipe';
import { SanitizeVideoUrlPipe } from './sanitize-video-url-pipe';



@NgModule({
  declarations: [
    SanitizeAndAutoLinkPipe,
    SanitizeEmbedPipe,
    SanitizeQRCodePipe,
    SanitizeVideoUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SanitizeAndAutoLinkPipe,
    SanitizeEmbedPipe,
    SanitizeQRCodePipe,
    SanitizeVideoUrlPipe
  ]
})
export class AppPipesModule { }
