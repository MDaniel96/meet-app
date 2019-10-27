import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Event } from 'src/app/models/Event';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { fadeInOutAnimation } from 'src/app/config/Animations';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SearchItemComponent {

  @Input() person: User;
  @Input() event: Event;
  @Input() my: boolean;

  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private globalService: GlobalService,
    private restService: RestService,
    private authService: AuthService
  ) {
  }

  /**
   * Navigating to friend details
   */
  selectPerson() {
    this.globalService.selectedUser = this.person;
    this.navCtrl.navigateForward(`/tabs/friends/${this.person.id.toString()}`);
  }

  /**
   * Add person as friend
   */
  addFriend() {
    this.subscription.add(
      this.restService.addFriendRequest(this.person.id)
        .subscribe((friend) => {
          console.log('Adding as friend...', friend);
        })
    );
  }

  /**
   * Navigating to event details
   */
  selectEvent() {
    this.globalService.selectedEvent = this.event;
    this.navCtrl.navigateForward(`/tabs/events/${this.event.id.toString()}`);
  }

  /**
   * Joining event
   */
  addEvent() {
    this.subscription.add(
      this.restService.addFriendsToEvent(this.event.id, [this.authService.loggedUser])
        .subscribe((event) => {
          console.log('Joining event...', event);
          this.my = true;
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
