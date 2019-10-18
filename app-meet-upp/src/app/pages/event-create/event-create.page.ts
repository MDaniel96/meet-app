import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from 'src/app/models/Event';
import { AppSettings } from 'src/app/config/AppSettings';
import { GlobalService } from 'src/app/services/selected-user.service';
import { User } from 'src/app/models/User';
import { Location } from 'src/app/models/Location';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { LoadingAnimationService } from 'src/app/services/loading.service';

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

  @Input() selectedFriend: User;

  subscription: Subscription = new Subscription();

  constructor(
    private modalCtrl: ModalController,
    private globalService: GlobalService,
    private authService: AuthService,
    private restService: RestService,
    private loadingAnimService: LoadingAnimationService
  ) {
  }

  ngOnInit() {
    this.init();
    console.log(this.selectedFriend);
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
    this.event.location = this.authService.loggedUser.location;
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
    if (this.selectedFriend) {
      this.selectedFriends = [this.selectedFriend];
      this.event.name = `${this.authService.loggedUser.name} meets ${this.selectedFriend.name}`;
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
                this.modalCtrl.dismiss({
                  'eventAdded': true
                });
              })
          );
        }
      })
    this.subscription.add(subscription);
  }

  /**
   * Throwing alert message if form not filled 
   */
  private validateForm(): boolean {
    console.log(this.selectedFriends);
    if (this.event.name === undefined || this.selectedFriends === undefined) {
      alert(AppSettings.MODAL_VALIDATION_ALERT);
      return true;
    }
    return false;
  }

  /**
   * Dismissing modal without adding event
   */
  dismiss() {
    this.modalCtrl.dismiss({
      'eventAdded': false
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
