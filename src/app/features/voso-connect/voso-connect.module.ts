import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDirectivesModule } from 'src/app/shared/directives/app-directives.module';
import { CommonComponentsModule } from 'src/app/shared/common-components';
import { VosoConnectRoutingModule } from './voso-connect-routing.module'; 
import { VosoConnectComponent } from './voso-connect.component';



@NgModule({
  declarations: [
    VosoConnectComponent
  ],
  imports: [
    CommonModule,
    AppDirectivesModule,
    CommonComponentsModule,
    VosoConnectRoutingModule
  ]
})
export class VosoConnectModule { }
