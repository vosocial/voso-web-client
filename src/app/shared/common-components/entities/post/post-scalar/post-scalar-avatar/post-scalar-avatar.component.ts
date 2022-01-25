import { Component, OnInit, Input } from '@angular/core';
import { BackendRoutes } from 'src/app/backend-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'post-scalar-avatar',
  templateUrl: './post-scalar-avatar.component.html',
  styleUrls: ['./post-scalar-avatar.component.css']
})
export class PostScalarAvatarComponent implements OnInit {

  @Input() publicKey: string;
  @Input() desoUserName: string;
  baseUri: string;

  constructor() { 
    this.baseUri = 'https://' + environment.node.host;
  }

  ngOnInit(): void {
  }

  getPosterAvatar(): string {
    return this.baseUri + BackendRoutes.RoutePathGetSingleProfilePicture + '/'
                        + this.publicKey
                        + '?fallback=https://' + environment.node.host + '/'
                        + environment.node.profile_pic_fallback
  }

}
