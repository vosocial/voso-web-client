import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VosoConnectStatusComponent } from './voso-connect-status.component';
import { LoadersModule } from '../../util/loaders/loaders.module';


@NgModule({
  declarations: [
    VosoConnectStatusComponent
  ],
  imports: [
    CommonModule,
    LoadersModule
  ],
  exports: [
    VosoConnectStatusComponent
  ]
})
export class VosoConnectStatusModule { }
