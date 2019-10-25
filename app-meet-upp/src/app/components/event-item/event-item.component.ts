import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { NavController } from '@ionic/angular';
import { Event } from 'src/app/models/Event';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent {

  @Input() event: Event;
  @Output() deleteEventEvent = new EventEmitter<Event>();

  constructor(
    private globalService: GlobalService,
    private navCtrl: NavController
  ) {
  }

  /**
   * If event is clicked, storing selected event and navigating to event-detail page
   */
  selectEvent() {
    this.globalService.selectedEvent = this.event;
    this.navCtrl.navigateForward(`/tabs/events/${this.event.id.toString()}`);
  }

  /**
   * Notifying parent if event to be deleted
   */
  deleteEvent() {
    this.deleteEventEvent.next(this.event);
  }

}
