import { Component, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { slideRightLeftAnimation } from 'src/app/config/Animations';
import { Location } from 'src/app/models/Location';


@Component({
  selector: 'app-map-buttons',
  templateUrl: './map-buttons.component.html',
  styleUrls: ['./map-buttons.component.scss'],
  animations: [ slideRightLeftAnimation ]
})
export class MapButtonsComponent {

  @Input() buttonsNeeded: boolean;

  @Output() myLocationClickedEvent = new EventEmitter<void>();

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
    this.myLocationClickedEvent.emit();
  }

  /**
   * Open Google Maps app and show route to friend
   */
  navigationClicked() {
    let location = this.mapService.getFriendLocation();
    this.openNavigation(location);
  }

  /**
   * Opens any navigation and navigates to location
   */
  private openNavigation(location: Location) {
    let destination = location.lat + ',' + location.lon;
    let label = encodeURI('Friend');
    window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
  }

}
