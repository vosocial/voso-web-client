import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VosoConnectButtonComponent } from './voso-connect-button.component';

describe('VosoConnectButtonComponent', () => {
  let component: VosoConnectButtonComponent;
  let fixture: ComponentFixture<VosoConnectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VosoConnectButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VosoConnectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
