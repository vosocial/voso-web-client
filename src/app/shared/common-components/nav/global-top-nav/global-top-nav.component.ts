import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuStates } from './providers/menu-states';
import { FlyoutMenuAnimation } from 'src/app/shared/animations';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'global-top-nav',
  templateUrl: './global-top-nav.component.html',
  styleUrls: ['./global-top-nav.component.css'],
  animations: [ FlyoutMenuAnimation ]
})
export class GlobalTopNavComponent implements OnInit {

  @Output() mobileMenuToggled: EventEmitter<boolean> = new EventEmitter()

  menuStateA: string;
  menuStateB: string;
  logoUri: string;

  constructor() { 
    this.menuStateA = MenuStates.HIDE;
    this.menuStateB = MenuStates.HIDE;
    this.logoUri = environment.cdn.endpoint + 'voso_color_web_logo.svg';
  }

  ngOnInit(): void {
  }

  toggleMenuState(which: string) {
    switch (which) {
      case 'a':
        this.menuStateA == MenuStates.HIDE ? this.menuStateA = MenuStates.SHOW
        : this.menuStateA = MenuStates.HIDE;
        break;
      case 'b':
        this.menuStateB == MenuStates.HIDE ? this.menuStateB = MenuStates.SHOW
        : this.menuStateB = MenuStates.HIDE;
        break;
    }
    console.log('this.meuState :: ', this.menuStateA);

  }

  toggleMobileMenu() {
    this.mobileMenuToggled.emit(true);
  }

}
