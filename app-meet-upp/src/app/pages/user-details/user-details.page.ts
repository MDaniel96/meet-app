import { Component } from '@angular/core';
import { SelectedUserService } from 'src/app/services/selected-user.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { FriendshipStatus } from 'src/app/models/FriendshipStatus';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: 'user-details.page.html',
  styleUrls: ['user-details.page.scss']
})
export class UserDetailsPage {

  user: User;
  friendStatus: FriendshipStatus;
  subscription: Subscription = new Subscription();

  constructor(
    private selectedUserService: SelectedUserService,
    private restService: RestService
  ) {
    this.initUserDetails();
  }

  /**
   * Get clicked user and friendship status
   */
  private initUserDetails() {
    this.user = this.selectedUserService.selectedUser;
    this.subscription.add(this.restService.getFriendshipStatus(this.user.id)
      .subscribe((status) => {
        this.friendStatus = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
