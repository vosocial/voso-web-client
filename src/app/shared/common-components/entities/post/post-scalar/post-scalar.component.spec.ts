import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScalarComponent } from './post-scalar.component';

describe('PostScalarComponent', () => {
  let component: PostScalarComponent;
  let fixture: ComponentFixture<PostScalarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostScalarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostScalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
