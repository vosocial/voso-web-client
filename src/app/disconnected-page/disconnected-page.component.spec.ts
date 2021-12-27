import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectedPageComponent } from './disconnected-page.component';

describe('DisconnectedPageComponent', () => {
  let component: DisconnectedPageComponent;
  let fixture: ComponentFixture<DisconnectedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisconnectedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
