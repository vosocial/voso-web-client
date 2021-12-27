import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VosoConnectComponent } from './voso-connect.component';

describe('VosoConnectComponent', () => {
  let component: VosoConnectComponent;
  let fixture: ComponentFixture<VosoConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VosoConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VosoConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
