import { Component, ViewChild } from '@angular/core';
import { SelectedUserService } from 'src/app/services/selected-user.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { FriendshipStatus } from 'src/app/models/FriendshipStatus';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { ProfileHeaderComponent } from 'src/app/components/profile-header/profile-header.component';
import { ProfileMapButtonsComponent } from 'src/app/components/profile-map-buttons/profile-map-buttons.component';

@Component({
  selector: 'app-user-details',
  templateUrl: 'user-details.page.html',
  styleUrls: ['user-details.page.scss']
})
export class UserDetailsPage {

  @ViewChild(ProfileHeaderComponent, { static: false }) profileHeaderComponent: ProfileHeaderComponent;
  @ViewChild(ProfileMapButtonsComponent, { static: false }) profileMapButtonsComponent: ProfileMapButtonsComponent;

  user: User;
  friendStatus: FriendshipStatus;

  subscription: Subscription = new Subscription();

  constructor(
    private selectedUserService: SelectedUserService,
    private restService: RestService,
    private mapService: MapService
  ) {
    this.initUserDetails();
    this.subscribeToMapEvents();
  }

  /**
   * Subscribing to map events 
   */
  private subscribeToMapEvents() {
    this.subscription.add(
      this.mapService.mapDragged$.subscribe(() => {
        this.showMapDraggedButtons();
      })
    );
    this.subscription.add(
      this.mapService.friendCentered$.subscribe(() => {
        this.showFriendCenteredButtons();
      })
    );
  }

  /**
   * When map dragged
   * - hiding profile button
   * - showing map buttons
   */
  private showMapDraggedButtons() {
    this.profileHeaderComponent.hideButtons();
    this.profileMapButtonsComponent.displayButtons();
  }

  /**
   * When map dragged
   * - showing profile button
   * - hiding map buttons
   */
  private showFriendCenteredButtons() {
    this.profileHeaderComponent.displayButtons();
    this.profileMapButtonsComponent.hideButtons();
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
