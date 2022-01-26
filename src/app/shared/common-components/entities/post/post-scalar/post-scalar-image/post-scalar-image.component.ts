import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'post-scalar-image',
  templateUrl: './post-scalar-image.component.html',
  styleUrls: ['./post-scalar-image.component.css']
})
export class PostScalarImageComponent implements OnInit, AfterViewInit {

  @Input() imageUri: string;

  debug: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.debug ? console.log('this.imageUri :: ', this.imageUri) : void 0;
  }

}
