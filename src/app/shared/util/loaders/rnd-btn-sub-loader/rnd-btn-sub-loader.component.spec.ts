import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RndBtnSubLoaderComponent } from './rnd-btn-sub-loader.component';

describe('RndBtnSubLoaderComponent', () => {
  let component: RndBtnSubLoaderComponent;
  let fixture: ComponentFixture<RndBtnSubLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RndBtnSubLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RndBtnSubLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
