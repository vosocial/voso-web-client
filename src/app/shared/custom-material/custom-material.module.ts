import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatBottomSheetModule,
    ScrollingModule
  ],
  exports: [
    MatBottomSheetModule,
    ScrollingModule
  ]
})
export class CustomMaterialModule { }
