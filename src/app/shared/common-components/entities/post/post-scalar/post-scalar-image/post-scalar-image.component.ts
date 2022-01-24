import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'post-scalar-image',
  templateUrl: './post-scalar-image.component.html',
  styleUrls: ['./post-scalar-image.component.css']
})
export class PostScalarImageComponent implements OnInit, AfterViewInit {

  @Input() imageUri: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      console.log('this.imageUri :: ', this.imageUri);
  }

}
