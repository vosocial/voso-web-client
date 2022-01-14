import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { CommonComponentsModule } from 'src/app/shared/common-components';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
