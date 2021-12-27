import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RndBtnSubLoaderModule } from './rnd-btn-sub-loader/rnd-btn-sub-loader.module';
import { SectionLoaderModule } from './section-loader/section-loader.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RndBtnSubLoaderModule,
    SectionLoaderModule
  ],
  exports: [
    RndBtnSubLoaderModule,
    SectionLoaderModule
  ]
})
export class LoadersModule { }
