import { Component, Input } from '@angular/core';
import { Event } from 'src/app/models/Event';
import { AppSettings } from 'src/app/config/AppSettings';
import { GlobalService } from 'src/app/services/global.service';
import { User } from 'src/app/models/User';
import { Location } from 'src/app/models/Location';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { LoadingAnimationService } from 'src/app/services/loading.service';
import { NavController } from '@ionic/angular';
import { MapService } from 'src/app/services/map.service';
import { LatLng } from '@ionic-native/google-maps/ngx';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage {

  event: Event;
  date: string;
  selectedFriends: User[];

  friends: User[];
  minimumDate: string;

  preselectedFriend: User;

  subscription: Subscription = new Subscription();

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private restService: RestService,
    private loadingAnimService: LoadingAnimationService,
    private navCtrl: NavController,
    private mapService: MapService
  ) {
  }

  ngOnInit() {
    this.init();
  }

  /**
   * Initializing new event
   */
  private init() {
    this.initLocation();
    this.initDate();
    this.initFriends();
    this.initMinimumDate();
    this.initPreselectedFriend();
  }

  /**
   * Initializing event's location and visibility
   */
  private initLocation() {
    this.event = new Event();
    this.event.public = true;
    this.event.location = new Location();
    this.event.location.lat = this.authService.loggedUser.location.lat;
    this.event.location.lon = this.authService.loggedUser.location.lon;
    this.detectLocatonChanges();
  }

  /**
   * Detecting location changes from map, if changed, store it in created event
   */
  private detectLocatonChanges() {
    this.subscription.add(
      this.mapService.locationSelected$
        .subscribe((coords: LatLng) => {
          this.event.location.lat = coords.lat;
          this.event.location.lon = coords.lng;
        })
    );
  }

  /**
   * Initializing new date 
   * - had to convert it to ISOString so date-picker can read it
   */
  private initDate() {
    let date = new Date();
    date.setHours((new Date()).getHours() + AppSettings.MODAL_DEFDATE_PLUS_HOURS);
    date.setMinutes(0);
    this.date = (new Date(date)).toISOString();
  }

  /**
   * Getting friends
   */
  private initFriends() {
    this.friends = this.globalService.friends;
  }

  /**
   * If there's friend preselected, filling up form
   */
  private initPreselectedFriend() {
    this.preselectedFriend = this.globalService.preselectedUser;
    if (this.preselectedFriend) {
      this.selectedFriends = [this.preselectedFriend];
      this.event.name = `${this.authService.loggedUser.name} meets ${this.preselectedFriend.name}`;
    }
  }

  /**
   * Setting minimum date in ISO format
   */
  private initMinimumDate() {
    this.minimumDate = new Date().toISOString();
  }

  /**
   * Adding new event and friends to server, dismissing modal
   */
  addEvent() {
    if (this.validateForm()) {
      return;
    }

    let date = new Date(this.date);
    this.event.time = date;
    this.loadingAnimService.presentLoading(AppSettings.CREATING_EVENT);

    const subscription = this.restService.addNewEvent(this.event)
      .subscribe((event) => {
        if (this.selectedFriends) {
          this.subscription.add(
            this.restService.addFriendsToEvent(event.id, this.selectedFriends)
              .subscribe((e) => {
                console.log('Event added', e);
                this.loadingAnimService.dismissLoading();
                this.globalService.creatingEvent();
                this.navigateBackAfterAddEvent();
              })
          );
        }
      })
    this.subscription.add(subscription);
  }

  /**
   * Navigating to original pages after add
   */
  private navigateBackAfterAddEvent() {
    if (this.preselectedFriend) {
      this.navCtrl.navigateBack(`/tabs/friends/${this.preselectedFriend.id}`);
    } else {
      this.navCtrl.navigateBack('/tabs/events');
    }
  }

  /**
   * Throwing alert message if form not filled 
   */
  private validateForm(): boolean {
    if (this.event.name === undefined || this.selectedFriends === undefined) {
      alert(AppSettings.MODAL_VALIDATION_ALERT);
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
