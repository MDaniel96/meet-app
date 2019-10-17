import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent {

  @Input() event: Event;
  @Output() deleteEventEvent = new EventEmitter<Event>();

  constructor() { }

  selectEvent() {
    console.log('Event selected...', this.event);
  }

  deleteEvent() {
    this.deleteEventEvent.next(this.event);
  }

}
