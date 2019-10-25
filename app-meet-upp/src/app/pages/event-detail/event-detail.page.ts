import { Component, ViewChild, NgZone } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Event } from 'src/app/models/Event';
import { RestService } from 'src/app/services/rest.service';
import { UserComment } from 'src/app/models/UserComment';
import { Subscription } from 'rxjs';
import { EventHeaderComponent } from 'src/app/components/event-header/event-header.component';
import { MapButtonsComponent } from 'src/app/components/map-buttons/map-buttons.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { MapService } from 'src/app/services/map.service';
import { User } from 'src/app/models/User';
import { slideTopBottomAnimation } from 'src/app/config/Animations';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  animations: [slideTopBottomAnimation]
})
export class EventDetailPage {

  @ViewChild(EventHeaderComponent, { static: false }) eventHeaderComponent: EventHeaderComponent;
  @ViewChild(MapButtonsComponent, { static: false }) mapButtonsComponent: MapButtonsComponent;
  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;

  event: Event;
  users: UserComment[];
  clickedUser: User | Event;

  subscription: Subscription = new Subscription();

  constructor(
    private globalService: GlobalService,
    private restService: RestService,
    private mapService: MapService,
    private zone: NgZone
  ) {
    this.initEventDetails();
    this.subscribeToMapEvents();
  }

  /**
   * When header clicked animating to friend
   */
  headerClicked() {
    this.mapComponent.animateToEvent();
  }

  /**
   * When my location center button clicked animated to logged in user
   */
  myLocationClicked() {
    this.mapComponent.animateToUser();
    this.hideProfileHeader();
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
      this.mapService.eventCentered$.subscribe(() => {
        this.showEventCenteredButtons();
      })
    );
    this.subscription.add(
      this.mapService.markerClicked$.subscribe((user) => {
        this.markerClickedButtons(user);
      })
    );
  }

  /**
   * When map dragged displaying buttons
   */
  private showMapDraggedButtons() {
    this.eventHeaderComponent.hideButtons();
    this.mapButtonsComponent.displayButtons();
    this.hideProfileHeader();
  }

  /**
   * When event centered displaying buttons
   */
  private showEventCenteredButtons() {
    this.eventHeaderComponent.displayButtons();
    this.mapButtonsComponent.hideButtons();
    this.hideProfileHeader();
  }

  /**
   * When a marker clicked displaying buttons
   */
  private markerClickedButtons(user: User | Event) {
    this.eventHeaderComponent.hideButtons();
    this.mapButtonsComponent.displayButtons();
    this.zone.run(() =>
      this.clickedUser = user
    );
  }

  /**
   * Hiding clicked user header
   */
  private hideProfileHeader() {
    this.zone.run(() =>
      this.clickedUser = null
    );
  }

  /**
   * Init selected event and its users
   */
  private initEventDetails() {
    this.event = this.globalService.selectedEvent;
    this.subscription.add(
      this.restService.getEventsUserComments(this.event.id)
        .subscribe((users) => {
          console.log('Getting users with comments...', users);
          this.users = users;
          this.globalService.eventUsers = users;
          this.eventHeaderComponent.getSelectableFriends();
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
