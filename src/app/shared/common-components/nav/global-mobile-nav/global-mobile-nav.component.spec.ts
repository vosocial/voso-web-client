import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMobileNavComponent } from './global-mobile-nav.component';

describe('GlobalMobileNavComponent', () => {
  let component: GlobalMobileNavComponent;
  let fixture: ComponentFixture<GlobalMobileNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalMobileNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMobileNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
