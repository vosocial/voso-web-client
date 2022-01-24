import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VosoConnectStatusModule } from './voso-connect-status/voso-connect-status.module';
import { VosoConnectButtonModule } from './voso-connect-button/voso-connect-button.module';
import { VosoDisconnectButtonModule } from './voso-disconnect-button/voso-disconnect-button.module';

import { PostScalarModule } from './entities/post/post-scalar';

import { FeedsModule } from './feeds/feeds.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeedsModule,
    PostScalarModule,
    VosoConnectStatusModule,
    VosoConnectButtonModule,
    VosoDisconnectButtonModule
  ],
  exports: [
    FeedsModule,
    PostScalarModule,
    VosoConnectStatusModule,
    VosoConnectButtonModule,
    VosoDisconnectButtonModule
  ]
})
export class CommonComponentsModule { }
