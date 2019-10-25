import { Component, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { slideRightLeftAnimation } from 'src/app/config/Animations';
import { Location } from 'src/app/models/Location';


@Component({
  selector: 'app-map-buttons',
  templateUrl: './map-buttons.component.html',
  styleUrls: ['./map-buttons.component.scss'],
  animations: [slideRightLeftAnimation]
})
export class MapButtonsComponent {

  @Input() buttonsNeeded: boolean;
  @Input() destination: Location;

  @Output() myLocationClickedEvent = new EventEmitter<void>();

  constructor(
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
   * Open Google Maps app and show route to destination
   */
  navigationClicked() {
    let destination = this.destination.lat + ',' + this.destination.lon;
    let label = encodeURI('destination');
    window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
  }

}
