import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'post-scalar-body',
  templateUrl: './post-scalar-body.component.html',
  styleUrls: ['./post-scalar-body.component.css']
})
export class PostScalarBodyComponent implements OnInit {

  @Input() postBody: string;

  constructor() { }

  ngOnInit(): void {
  }

}
