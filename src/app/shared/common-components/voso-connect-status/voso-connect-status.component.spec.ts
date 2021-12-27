import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VosoConnectStatusComponent } from './voso-connect-status.component';

describe('VosoConnectStatusComponent', () => {
  let component: VosoConnectStatusComponent;
  let fixture: ComponentFixture<VosoConnectStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VosoConnectStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VosoConnectStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
