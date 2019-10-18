import { Component, Input, OnInit, NgZone } from '@angular/core';
import { User } from 'src/app/models/User';
import { FriendshipStatus, FriendStatuses } from 'src/app/models/FriendshipStatus';
import { AppSettings } from 'src/app/config/AppSettings';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { MapService } from 'src/app/services/map.service';
import { foldAnimation } from 'src/app/config/Animations';
import { ModalService } from 'src/app/services/modal.service';
import { EventCreatePage } from 'src/app/pages/event-create/event-create.page';
import { ComponentProps } from '@ionic/core';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  animations: [ foldAnimation ]
})
export class ProfileHeaderComponent implements OnInit {

  @Input() user: User;
  @Input() buttonsNeeded: boolean;
  @Input() friendStatus: FriendshipStatus;

  friendStatusText: string;

  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService,
    private mapService: MapService,
    private zone: NgZone,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.setFriendStatusText();
  }

  /**
   * If profile header clicked
   * - navigating back to friend
   * - detecting friend status -> if true we are at friend profile (not at user settings)
   */
  headerClicked() {
    if (this.friendStatus) {
      this.mapService.animateToFriend();
    }
  }

  /**
   * Displaying buttons
   */
  displayButtons() {
    if (this.friendStatus) {
      this.zone.run(() =>
        this.buttonsNeeded = true
      );
    }
  }

  /**
   * Hiding buttons
   */
  hideButtons() {
    this.zone.run(() =>
      this.buttonsNeeded = false
    );
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
   * Adding event and subscribing to dismissed event
   */
  async addEvent() {
    await this.modalService.presentModal(EventCreatePage, this.user);
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
