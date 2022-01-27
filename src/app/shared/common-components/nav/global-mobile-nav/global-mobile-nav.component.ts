import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'global-mobile-nav',
  templateUrl: './global-mobile-nav.component.html',
  styleUrls: ['./global-mobile-nav.component.css']
})
export class GlobalMobileNavComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef) { }

  ngOnInit(): void {
  }

}
