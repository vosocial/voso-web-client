import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VosoDisconnectButtonComponent } from './voso-disconnect-button.component';



@NgModule({
  declarations: [
    VosoDisconnectButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    VosoDisconnectButtonComponent
  ]
})
export class VosoDisconnectButtonModule { }
