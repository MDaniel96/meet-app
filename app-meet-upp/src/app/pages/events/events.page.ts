import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/models/Event';
import { RestService } from 'src/app/services/rest.service';
import { LoadingAnimationService } from 'src/app/services/loading.service';
import { AppSettings } from 'src/app/config/AppSettings';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage {

  subscription: Subscription = new Subscription();

  events: Event[];
  todayEvents: Event[];
  thisMonthEvents: Event[];
  futureEvents: Event[];
  nextYearEvents: Event[];

  refreshEventsEvent: any;

  constructor(
    private restService: RestService,
    private loadingAnimation: LoadingAnimationService,
    private navCtrl: NavController,
    private globalService: GlobalService,
    private calendarService: CalendarService,
    private authService: AuthService
  ) {
    this.detectEventCreated();
  }

  /**
   * Refresh list when entering page
   */
  ionViewWillEnter() {
    this.getEventList();
  }

  /**
   * Navigating to event creator page
   */
  addEvent() {
    this.navCtrl.navigateForward('/addEvent');
  }

  /**
   * Deleting event and refreshing list
   */
  deleteEvent(event) {
    const subscription = this.restService.deleteEvent(event.id)
      .subscribe((event) => {
        console.log('Deleting event...', event);
        this.getEventList();
      });
    this.subscription.add(subscription);
  }

  /**
   * Ion-refresh pulled, refreshing events
   */
  refreshEvents(event) {
    console.log('Refreshing events...');
    this.refreshEventsEvent = event;
    this.getEventList();
  }

  /**
   * Detect event created, so list can be refreshed
   */
  private detectEventCreated() {
    this.subscription.add(
      this.globalService.eventCreated$
        .subscribe(() => {
          this.getEventList();
        })
    );
  }

  /**
   * Getting and parsing lists of events, using loading animations
   */
  private getEventList() {
    this.startLoadingAnim();
    const subscription = this.restService.getEventList()
      .subscribe((events) => {
        console.log('Getting events...', events);
        this.events = events;
        this.getTodayEvents();
        this.getThisMonthEvents();
        this.getFutureEvents();
        this.getNextYearEvents();
        this.stopLoadingAnim();
        this.synchEvents();
      });
    this.subscription.add(subscription);
  }

  /**
   * Synchronizing events if it is set
   */
  private synchEvents() {
    if (this.authService.loggedUser.setting.calendar) {
      this.calendarService.synchronizeEvents(this.events);
    }
  }

  /**
   * Starting event loading anim
   */
  private startLoadingAnim() {
    this.loadingAnimation.presentLoading(AppSettings.LOADING_EVENTS);
  }

  /**
   * Stopping loading anim and ion-refresher
   */
  private stopLoadingAnim() {
    if (this.refreshEventsEvent) {
      this.refreshEventsEvent.target.complete();
      this.refreshEventsEvent = null;
    }
    this.loadingAnimation.dismissLoading();
  }

  /**
   * Selecting todays events
   */
  private getTodayEvents() {
    let today = new Date();
    this.todayEvents = this.events.filter(e =>
      new Date(e.time).getDay() === today.getDay() &&
      new Date(e.time).getMonth() === today.getMonth() &&
      new Date(e.time).getFullYear() === today.getFullYear()
    );
  }

  /**
   * Selecting this month's events
   */
  private getThisMonthEvents() {
    let today = new Date();
    this.thisMonthEvents = this.events.filter(e =>
      new Date(e.time).getDay() !== today.getDay() &&
      new Date(e.time).getMonth() === today.getMonth() &&
      new Date(e.time).getFullYear() === today.getFullYear()
    );
  }

  /**
   * Selecting events which are not today are this month's
   */
  private getFutureEvents() {
    let today = new Date();
    this.futureEvents = this.events.filter(e =>
      new Date(e.time).getMonth() !== today.getMonth() &&
      new Date(e.time).getFullYear() === today.getFullYear()
    );
  }

  /**
   * Selecting events not this year
   */
  private getNextYearEvents() {
    this.nextYearEvents = this.events.filter(e =>
      new Date(e.time).getFullYear() !== (new Date()).getFullYear()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
