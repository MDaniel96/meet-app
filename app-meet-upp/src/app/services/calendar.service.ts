import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AppSettings } from '../config/AppSettings';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  startDate: Date;
  endDate: Date;

  constructor(
    private restService: RestService,
    private calendar: Calendar
  ) {
    this.initRange();
  }

  /**
   * Getting events from db and synchronizing them in calendar
   */
  refreshAndSynchronizeEvents(subscription: Subscription) {
    subscription.add(
      this.restService.getEventList()
        .subscribe((events) => {
          this.synchronizeEvents(events);
        })
    );
  }

  /**
   * Deleting all app calendar data
   */
  unsynchronizeEvents() {
    console.log('Unsynchronizing calendar...');

    this.listAppEvents().then((data) => {
      let synchronizedEventNames: string[] = this.getEventNames(data);
      console.log('Deleting calendar events...', synchronizedEventNames);
      synchronizedEventNames.forEach((eventName) => {
        this.deleteEvent(eventName);
      });
    });
  }

  /**
   * Synchronizing events in calendar and logging result
   */
  synchronizeEvents(events: Event[]) {
    console.log('Synchronizing calendar...');

    this.listAppEvents().then((data) => {
      let synchronizedEventNames: string[] = this.getEventNames(data);
      this.synchNewEvents(events, synchronizedEventNames);
      this.unsynchOldEvents(events, synchronizedEventNames);
    });
  }

  /**
   * Logging calendar data
   */
  logCalendarData() {
    this.listAppEvents().then((data) => {
      console.log('Calendar data:', data);
    });
  }

  /**
   * Adding events what are not in calendar
   */
  private synchNewEvents(events: Event[], synchronizedEventNames: string[]) {
    events.forEach((event) => {
      if (!synchronizedEventNames.includes(event.name)) {
        console.log('Creating calendar event for', event.name)
        this.createEvent(event.name, new Date(event.time));
      }
    });
  }

  /**
   * Deleting events what are not in events
   */
  private unsynchOldEvents(events: Event[], synchronizedEventNames: string[]) {
    synchronizedEventNames.forEach((eventName) => {
      if (!events.map(e => e.name).includes(eventName)) {
        console.log('Deleting calendar event for', eventName);
        this.deleteEvent(eventName);
      }
    });
  }

  /**
   * Initializing time range (mandatory for search and delete)
   */
  private initRange() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setFullYear(this.startDate.getFullYear() - AppSettings.CALENDAR_RANGE_MINUS);
    this.endDate.setFullYear(this.endDate.getFullYear() + AppSettings.CALENDAR_RANGE_PLUS);
  }

  /**
   * Creating event, logging if error
   */
  private createEvent(name: string, date: Date) {
    let endingDate = new Date(date);
    endingDate.setHours(endingDate.getHours() + AppSettings.CALENDAR_EVENT_DURATION_H);

    this.calendar.createEvent(name, AppSettings.CALENDAR_EVENT_LOCATION, null, date, endingDate).then(res => {
    }, err => {
      console.log('Error creating calendar event', err);
    });
  }

  /**
   * Deleting event, logging if error
   */
  private deleteEvent(name: string) {
    this.calendar.deleteEvent(name, null, null, this.startDate, this.endDate).then(res => {
    }, err => {
      console.log('Error deleting calendar event', err);
    });
  }

  /**
   * Returns all events of the app
   */
  private async listAppEvents(): Promise<any> {
    let events: any;
    await this.calendar.findEvent(null, AppSettings.CALENDAR_EVENT_LOCATION, null, this.startDate, this.endDate)
      .then(data => {
        events = data;
      });
    return events;
  }

  /**
   * Converting calendar data to a list of string event names
   */
  private getEventNames(data: any[]): string[] {
    let eventNames: string[] = [];
    data.forEach(element => {
      eventNames.push(element.title);
    });
    return eventNames;
  }

}
