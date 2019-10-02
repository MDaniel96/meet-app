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
  friendsSelected: boolean = true;
  util: Util = new Util();

  constructor() { }

  /**
   * If page is just consctructed (after login) updating location too
   * else just updating friends
   */
  ionViewWillEnter() {
    if (this.friendsSelected) {
      if (this.util.isFirstTime()) {
        this.friendsComponent.updateLocationAndFriendsList();
      } else {
        this.friendsComponent.getFriendLists(null, true);
      }
    }
  }
  
}
