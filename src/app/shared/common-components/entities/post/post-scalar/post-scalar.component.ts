import { BasePost, IPost } from '@adonoustech/desoscript-core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'post-scalar',
  templateUrl: './post-scalar.component.html',
  styleUrls: ['./post-scalar.component.css']
})
export class PostScalarComponent extends BasePost implements OnInit {
  // from BasePost (transformed to Input)
  @Input() post: IPost;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
