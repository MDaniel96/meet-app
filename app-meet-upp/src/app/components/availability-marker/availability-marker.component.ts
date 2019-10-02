import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { AppSettings } from 'src/app/config/AppSettings';

@Component({
  selector: 'availability-marker',
  templateUrl: './availability-marker.component.html',
})
export class AvailabilityMarkerComponent {

  @Input() friend: User;

  constructor() { }

  isFriendAvailable() {
    let from = new Date(this.friend.location.time);
    let today = new Date();
    let diffMinutes = Math.floor((today.getTime() - from.getTime()) / 1000 / 60);
    return diffMinutes <= AppSettings.AVAILABILITY_DURATION_MIN;
  }

}
