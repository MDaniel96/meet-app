import { Component, ViewChild, OnInit } from '@angular/core';
import { FriendsComponent } from 'src/app/components/friends/friends.component';
import { Util } from 'src/app/util/Util';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {

  @ViewChild(FriendsComponent, { static: false }) friendsComponent: FriendsComponent;
  util: Util = new Util();
  friendsSelected: boolean = true;

  constructor() { }

  /**
   * When tabs change update friend list
   */
  tabChanged() {
    this.friendsSelected = !this.friendsSelected;
    if (this.friendsSelected) {
      this.friendsComponent.getFriendList(true);
    }
  }

  /**
   * If page is just consctructed (after login) updating location too
   * else just updating friends
   */
  ionViewWillEnter() {
    if (this.friendsSelected) {
      if (this.util.isFirstTime()) {
        this.friendsComponent.getFriendListWithLocationUpdate();
      } else {
        this.friendsComponent.getFriendList(true);
      }
    }
  }

}
