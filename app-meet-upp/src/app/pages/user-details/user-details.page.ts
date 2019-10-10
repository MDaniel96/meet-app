import { Component, ViewChild } from '@angular/core';
import { SelectedUserService } from 'src/app/services/selected-user.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { FriendshipStatus } from 'src/app/models/FriendshipStatus';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { ProfileHeaderComponent } from 'src/app/components/profile-header/profile-header.component';

@Component({
  selector: 'app-user-details',
  templateUrl: 'user-details.page.html',
  styleUrls: ['user-details.page.scss']
})
export class UserDetailsPage {

  @ViewChild(ProfileHeaderComponent, { static: false }) profileHeaderComponent: ProfileHeaderComponent;

  user: User;
  friendStatus: FriendshipStatus;

  subscription: Subscription = new Subscription();

  constructor(
    private selectedUserService: SelectedUserService,
    private restService: RestService,
    private mapService: MapService
  ) {
    this.initUserDetails();
    this.subscribeToMapDragged();
  }

  /**
   * Hiding profile buttons, displaying map buttons when map is dragged 
   */
  private subscribeToMapDragged() {
    this.subscription.add(
      this.mapService.mapDragged$.subscribe(() => {
        this.profileHeaderComponent.hideButtons();
      })
    );
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
