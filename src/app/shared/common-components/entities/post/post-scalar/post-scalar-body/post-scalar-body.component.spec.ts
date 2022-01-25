import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScalarBodyComponent } from './post-scalar-body.component';

describe('PostScalarBodyComponent', () => {
  let component: PostScalarBodyComponent;
  let fixture: ComponentFixture<PostScalarBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostScalarBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostScalarBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
