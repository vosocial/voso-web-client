import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VosoConnectStatusModule } from './voso-connect-status/voso-connect-status.module';
import { VosoConnectButtonModule } from './voso-connect-button/voso-connect-button.module';
import { VosoDisconnectButtonModule } from './voso-disconnect-button/voso-disconnect-button.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VosoConnectStatusModule,
    VosoConnectButtonModule,
    VosoDisconnectButtonModule
  ],
  exports: [
    VosoConnectStatusModule,
    VosoConnectButtonModule,
    VosoDisconnectButtonModule
  ]
})
export class CommonComponentsModule { }
