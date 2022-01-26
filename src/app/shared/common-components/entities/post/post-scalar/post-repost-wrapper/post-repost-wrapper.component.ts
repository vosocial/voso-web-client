import { BasePost, IPost } from '@adonoustech/desoscript-core';
import { Component, 
         OnInit,
         AfterViewInit,
         Input,
         ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'post-repost-wrapper',
  templateUrl: './post-repost-wrapper.component.html',
  styleUrls: ['./post-repost-wrapper.component.css']
})
export class PostRepostWrapperComponent extends BasePost implements OnInit, AfterViewInit {

  @Input() post: IPost;

  repost: IPost;
  debug: boolean = true;
  
  constructor(private cd: ChangeDetectorRef) {
      super(); 
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      if (this.post) {
        if (this.post.RepostedPostEntryResponse) {
          this.repost = this.post.RepostedPostEntryResponse;
          this.cd.detectChanges();
        } else {
          console.warn('[WARN] - Initialization indicated repost, but none found.');
          this.debug ? console.log('this.repost :: ', this.post) : void 0;
        }
      } else {
        this.debug ? console.log('post not found :: ', this.post) : void 0;
      }
  }

}
