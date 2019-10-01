import { Component, ViewChild } from '@angular/core';
import { FriendsComponent } from 'src/app/components/friends/friends.component';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {
  @ViewChild(FriendsComponent, {static: false}) friendsComponent: FriendsComponent;
  friendsSelected: boolean = true;

  constructor() {}

  /**
   * Update components lists when page changes
   */
  ionViewWillEnter() {
    this.friendsComponent.updateFriendsList();
  }
}
