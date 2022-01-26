import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRepostWrapperComponent } from './post-repost-wrapper.component';

describe('PostRepostWrapperComponent', () => {
  let component: PostRepostWrapperComponent;
  let fixture: ComponentFixture<PostRepostWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostRepostWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRepostWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
