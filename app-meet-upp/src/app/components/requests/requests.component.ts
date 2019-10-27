import { Component, Input } from '@angular/core';
import { FriendRequest } from 'src/app/models/FriendRequest';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';
import { foldAnimation } from 'src/app/config/Animations';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  animations: [foldAnimation]
})
export class RequestsComponent {

  @Input() requests: FriendRequest[];

  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService
  ) {
  }

  /**
   * Accepts a friend request
   */
  accept(requestId: string) {
    this.deleteRequestFromList(requestId);
    this.subscription.add(
      this.restService.acceptFriendRequest(requestId)
        .subscribe((a) => console.log('Request accepted...'))
    );
  }

  /**
   * Declines a friend request
   */
  decline(requestId: string) {
    this.deleteRequestFromList(requestId);
    this.subscription.add(
      this.restService.cancelFriendRequest(requestId)
        .subscribe((a) => console.log('Request declined...'))
    );
  }

  /**
   * Deletes request from list
   */
  private deleteRequestFromList(requestId: string) {
    this.requests = this.requests.filter(req => req.id !== requestId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}