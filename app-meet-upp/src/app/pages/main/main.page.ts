import { Component, ViewChild } from '@angular/core';
import { FriendsComponent } from 'src/app/components/friends/friends.component';
import { Util } from 'src/app/util/Util';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { FriendRequest } from 'src/app/models/FriendRequest';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {

  @ViewChild(FriendsComponent, { static: false }) friendsComponent: FriendsComponent;

  util: Util = new Util();
  friendsSelected: boolean = true;

  friendRequests: FriendRequest[];
  friendRequestCount: number;

  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService,
  ) {
  }

  /**
   * When tabs change update components
   */
  tabChanged() {
    this.friendsSelected = !this.friendsSelected;
    if (this.friendsSelected) {
      this.friendsComponent.getFriendList(true);
      this.getFriendRequests();
    }
  }

  /**
   * If page is just consctructed (after login) updating location too
   * else just updating friends
   * or updating requests
   */
  ionViewWillEnter() {
    if (this.friendsSelected) {
      if (this.util.isFirstTime()) {
        this.friendsComponent.getFriendListWithLocationUpdate();
      } else {
        this.friendsComponent.getFriendList(true);
      }
      this.getFriendRequests();
    }
  }

  /**
   * Getting friend requests of logged in user
   */
  getFriendRequests() {
    this.subscription.add(
      this.restService.getFriendRequests()
        .subscribe((requests) => {
          console.log('Getting friend requests...', requests);
          this.friendRequests = requests;
          this.friendRequestCount = requests.length;
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
