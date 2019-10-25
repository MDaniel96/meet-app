import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Event } from 'src/app/models/Event';
import { Subscription } from 'rxjs';
import { foldAnimation, fadeInOutAnimation, horizontalFoldAnimation } from 'src/app/config/Animations';
import { RestService } from 'src/app/services/rest.service';
import { MapService } from 'src/app/services/map.service';
import { User } from 'src/app/models/User';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  animations: [
    foldAnimation,
    fadeInOutAnimation,
    horizontalFoldAnimation
  ]
})
export class EventHeaderComponent {

  @Input() event: Event;
  @Input() buttonsNeeded: boolean;

  @Output() headerClickedEvent = new EventEmitter<void>();

  addingComment: boolean = false;
  addingFriends: boolean = false;
  comment: string = '';

  selectableFriends: User[] = [];
  notSelectableFriends: User[] = [];
  selectedFriends: User[] = [];

  subscription: Subscription = new Subscription();

  constructor(
    private zone: NgZone,
    private restService: RestService,
    private mapService: MapService,
    private globalService: GlobalService
  ) {
  }

  /**
   * If profile header clicked notifying parent
   */
  headerClicked() {
    this.headerClickedEvent.emit();
  }

  /**
   * Displaying buttons
   */
  displayButtons() {
    this.zone.run(() =>
      this.buttonsNeeded = true
    );
  }

  /**
   * Hiding buttons
   */
  hideButtons() {
    this.zone.run(() =>
      this.buttonsNeeded = false
    );
  }

  /**
   * Adding comment to server, refreshing map
   */
  addComment() {
    this.subscription.add(
      this.restService.addCommentToEvent(this.event.id, this.comment)
        .subscribe((comment) => {
          console.log('Adding comment...', comment);
          this.addingComment = false;
          this.comment = '';
          this.mapService.setUserComment(comment.text);
        })
    );
  }

  /**
   * Adding friends to server, refreshing map
   */
  addFriend() {
    this.subscription.add(
      this.restService.addFriendsToEvent(this.event.id, this.selectedFriends)
        .subscribe((event) => {
          console.log('Adding friends...', event, this.selectedFriends);
          this.addingFriends = false;
          this.selectableFriends = [];
          this.mapService.setAddedFriends(this.selectedFriends, this.subscription);
        })
    );
  }

  /**
   * Selectable friends are friends who are not at the event (called by event-detail page)
   */
  getSelectableFriends() {
    this.notSelectableFriends = this.globalService.eventUsers.map(u => u.user);
    let friends = this.globalService.friends;

    friends.forEach((friend) => {
      if (!this.notSelectableFriends.map(ns => ns.id).includes(friend.id)) {
        this.selectableFriends.push(friend);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
