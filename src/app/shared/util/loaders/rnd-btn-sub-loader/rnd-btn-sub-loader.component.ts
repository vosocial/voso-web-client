import { Component, 
         OnInit,
         Input } from '@angular/core';

@Component({
  selector: 'rnd-btn-sub-loader',
  templateUrl: './rnd-btn-sub-loader.component.html',
  styleUrls: ['./rnd-btn-sub-loader.component.css']
})
export class RndBtnSubLoaderComponent implements OnInit {

  @Input() id: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
