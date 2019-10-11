import { Component, Input, NgZone } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { slideRightLeftAnimation } from 'src/app/config/Animations';
import { Location } from 'src/app/models/Location';


@Component({
  selector: 'app-profile-map-buttons',
  templateUrl: './profile-map-buttons.component.html',
  styleUrls: ['./profile-map-buttons.component.scss'],
  animations: [slideRightLeftAnimation]
})
export class ProfileMapButtonsComponent {

  @Input() buttonsNeeded: boolean;

  constructor(
    private mapService: MapService,
    private zone: NgZone
  ) { }

  /**
   * Hiding buttons
   */
  hideButtons() {
    this.zone.run(() =>
      this.buttonsNeeded = false
    );
  }

  /**
   * Displaying buttons
   */
  displayButtons() {
    this.zone.run(() =>
      this.buttonsNeeded = true
    );
  }

  /**
   * Animate to logged in user location
   */
  myLocationClicked() {
    this.mapService.animateToUser();
  }

  /**
   * Open Google Maps app and show route to friend
   */
  navigationClicked() {
    let location = this.mapService.getFriendLocation();
    this.openGoogleMapNavigation(location);
  }

  /**
   * Opens google map and navigates to location
   */
  private openGoogleMapNavigation(location: Location) {
    let destination = location.lat + ',' + location.lon;
    let label = encodeURI('Friend');
    window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
  }

}
