import { Component, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { FriendshipStatus } from 'src/app/models/FriendshipStatus';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { ProfileHeaderComponent } from 'src/app/components/profile-header/profile-header.component';
import { MapButtonsComponent } from 'src/app/components/map-buttons/map-buttons.component';
import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-user-details',
  templateUrl: 'user-details.page.html',
  styleUrls: ['user-details.page.scss']
})
export class UserDetailsPage {

  @ViewChild(ProfileHeaderComponent, { static: false }) profileHeaderComponent: ProfileHeaderComponent;
  @ViewChild(MapButtonsComponent, { static: false }) mapButtonsComponent: MapButtonsComponent;
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;

  user: User;
  friendStatus: FriendshipStatus;

  subscription: Subscription = new Subscription();

  constructor(
    private globalService: GlobalService,
    private restService: RestService,
    private mapService: MapService
  ) {
    this.initUserDetails();
    this.subscribeToMapEvents();
  }

  /**
   * When header clicked animating to friend
   */
  headerClicked() {
    this.mapComponent.animateToFriend();
  }

  /**
   * When my location center button clicked animated to logged in user
   */
  myLocationClicked() {
    this.mapComponent.animateToUser();
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
    this.mapButtonsComponent.displayButtons();
  }

  /**
   * When map dragged
   * - showing profile button
   * - hiding map buttons
   */
  private showFriendCenteredButtons() {
    this.profileHeaderComponent.displayButtons();
    this.mapButtonsComponent.hideButtons();
  }

  /**
   * Get clicked user and friendship status
   */
  private initUserDetails() {
    this.user = this.globalService.selectedUser;
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
