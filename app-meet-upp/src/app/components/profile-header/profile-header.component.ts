import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { FriendshipStatus, FriendStatuses } from 'src/app/models/FriendshipStatus';
import { AppSettings } from 'src/app/config/AppSettings';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {

  @Input() user: User;
  @Input() buttonsNeeded: boolean;
  @Input() friendStatus: FriendshipStatus;

  friendStatusText: string;

  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService
  ) { }

  ngOnInit() {
    this.setFriendStatusText();
  }

  /**
   * Add friend request to server and set button, string
   */
  addFriendRequest() {
    const subscription = this.restService.addFriendRequest(this.user.id)
      .subscribe((friendRequest) => {
        console.log('Adding friend request...', friendRequest);
        this.friendStatus.status = FriendStatuses.ON_THE_WAY;
        this.friendStatusText = AppSettings.PENDING_FRIEND;
      });
    this.subscription.add(subscription);
  }

  /**
   * Delete friendship from server and set button, string
   */
  deleteFriend() {
    const subcription = this.restService.deleteFriendship(this.user.id)
      .subscribe((deletedFriend) => {
        console.log('Deleting friend...', deletedFriend);
        this.friendStatus.status = FriendStatuses.NOT_ACCEPTED;
        this.setFriendStatusText();
      });
    this.subscription.add(subcription);
  }

  /**
   * Set text under add-friend-button
   */
  private setFriendStatusText() {
    if (this.friendStatus) {
      if (this.friendStatus.status === FriendStatuses.ACCEPTED) {
        this.friendStatusText = AppSettings.REMOVE_FRIEND;
      } else
        if (this.friendStatus.status === FriendStatuses.NOT_ACCEPTED) {
          this.friendStatusText = AppSettings.ADD_FRIEND;
        } else
          if (this.friendStatus.status === FriendStatuses.ON_THE_WAY) {
            this.friendStatusText == AppSettings.PENDING_FRIEND;
          }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
