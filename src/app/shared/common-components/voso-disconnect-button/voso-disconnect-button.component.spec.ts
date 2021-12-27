import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VosoDisconnectButtonComponent } from './voso-disconnect-button.component';

describe('VosoDisconnectButtonComponent', () => {
  let component: VosoDisconnectButtonComponent;
  let fixture: ComponentFixture<VosoDisconnectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VosoDisconnectButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VosoDisconnectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
