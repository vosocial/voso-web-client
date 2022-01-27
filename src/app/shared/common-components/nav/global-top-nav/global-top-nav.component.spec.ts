import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTopNavComponent } from './global-top-nav.component';

describe('GlobalTopNavComponent', () => {
  let component: GlobalTopNavComponent;
  let fixture: ComponentFixture<GlobalTopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalTopNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
