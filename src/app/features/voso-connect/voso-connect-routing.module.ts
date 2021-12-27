import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VosoConnectComponent } from './voso-connect.component';

const routes: Routes = [
  {
    path: '',
    component: VosoConnectComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class VosoConnectRoutingModule { }
