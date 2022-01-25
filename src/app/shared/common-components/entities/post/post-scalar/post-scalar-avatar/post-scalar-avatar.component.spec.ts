import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScalarAvatarComponent } from './post-scalar-avatar.component';

describe('PostScalarAvatarComponent', () => {
  let component: PostScalarAvatarComponent;
  let fixture: ComponentFixture<PostScalarAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostScalarAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostScalarAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
