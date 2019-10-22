import { Component, Input, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/User';
import { FriendshipStatus, FriendStatuses } from 'src/app/models/FriendshipStatus';
import { AppSettings } from 'src/app/config/AppSettings';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { foldAnimation } from 'src/app/config/Animations';
import { GlobalService } from 'src/app/services/global.service';
import { NavController } from '@ionic/angular';

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

  @Output() headerClickedEvent = new EventEmitter<void>();

  friendStatusText: string;

  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService,
    private zone: NgZone,
    private globalService: GlobalService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.setFriendStatusText();
  }

  /**
   * If profile header clicked notifying parent
   */
  headerClicked() {
    if (this.friendStatus) {
      this.headerClickedEvent.emit();
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
   * Open create event page and preselect user
   */
  addEvent() {
    this.globalService.preselectedUser = this.globalService.selectedUser;
    this.navCtrl.navigateForward('addEvent');
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
