import { Component } from '@angular/core';
import { foldUpAnimation, foldDownAnimation, fadeInOutAnimation } from 'src/app/config/Animations';
import { RestService } from 'src/app/services/rest.service';
import { User } from 'src/app/models/User';
import { Event } from 'src/app/models/Event';
import { Observable } from 'rxjs';
import { map, defaultIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  animations: [
    foldUpAnimation,
    foldDownAnimation,
    fadeInOutAnimation
  ]
})
export class SearchPage {

  focus: boolean;
  people: boolean;
  events: boolean;
  keyword: string;

  isFriends$: Observable<boolean>;
  isOthers$: Observable<boolean>;
  isMyEvents$: Observable<boolean>;
  isOtherEvents$: Observable<boolean>;

  friends$: Observable<User[]>;
  others$: Observable<User[]>;
  myEvents$: Observable<Event[]>;
  otherEvents$: Observable<Event[]>;

  constructor(
    private restService: RestService
  ) {
    this.init();
  }

  /**
   * Search when keyword changes
   */
  keywordChanged() {
    if (this.keyword !== '') {
      this.friends$ = this.restService.searchMyFriends(this.keyword);
      this.isFriends$ = this.friends$.pipe(
        map(friends => friends.length > 0),
        defaultIfEmpty(false)
      );
      this.others$ = this.restService.searchOthers(this.keyword);
      this.isOthers$ = this.others$.pipe(
        map(others => others.length > 0),
        defaultIfEmpty(false)
      );
      this.myEvents$ = this.restService.searchMyEvents(this.keyword);
      this.isMyEvents$ = this.myEvents$.pipe(
        map(events => events.length > 0),
        defaultIfEmpty(false)
      );
      this.otherEvents$ = this.restService.searchOtherEvents(this.keyword);
      this.isOtherEvents$ = this.otherEvents$.pipe(
        map(events => events.length > 0),
        defaultIfEmpty(false)
      );
    } else {
      this.initObservables();
    }
  }

  /**
   * Initing when leaving page 
   */
  ionViewWillLeave() {
    this.init();
  }

  /**
   * Initializing variables
   */
  private init() {
    this.focus = false;
    this.people = false;
    this.events = false;
    this.keyword = '';
    this.initObservables();
  }

  /**
   * Initializing observables
   */
  private initObservables() {
    this.isFriends$ = null;
    this.isOthers$ = null;
    this.isMyEvents$ = null;
    this.isOtherEvents$ = null;
  }

}
