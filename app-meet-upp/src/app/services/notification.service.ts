import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { RestService } from './rest.service';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { User } from '../models/User';
import { AppSettings } from '../config/AppSettings';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private localNotifications: LocalNotifications,
    private restService: RestService,
    private authService: AuthService,
    private backgroundMode: BackgroundMode,
  ) {
  }

  /**
   * Starting notification service
   * - enabling background mode
   * - detecting switching to background mode
   * - if app in background showing notifs in given periods (if set)
   */
  start(subscription: Subscription) {
    this.backgroundMode.enable();
    let timer;

    const sub = this.backgroundMode.on("activate")
      .subscribe(() => {
        console.log('Background mode activated...');
        timer = setInterval(() => {
          this.showNearbyNotif(subscription);
        }, AppSettings.NOTIF_UPDATE_MILISEC);
      });
    subscription.add(sub);

    const deSub = this.backgroundMode.on("deactivate")
      .subscribe(() => {
        console.log('Background mode deactivated...');
        clearInterval(timer);
      });
    subscription.add(deSub);
  }

  /**
   * Showing notif about nearby friends if there are any
   */
  private showNearbyNotif(subscription: Subscription) {
    const sub = this.restService.getFriendsList()
      .subscribe((friends) => {
        const nearbyFriends = this.getNearbyFriends(friends);
        console.log('Showing notif...', friends);
        if (nearbyFriends && nearbyFriends.length !== 0) {
          const notifTitle = this.getNearbyNotifTitle(nearbyFriends);
          this.scheduleNotif(notifTitle);
        }
      });
    subscription.add(sub);
  }

  /**
   * Returns users who are within logged in user's radius
   */
  private getNearbyFriends(friends: User[]): User[] {
    return friends.filter(f => f.distance <= this.authService.loggedUser.setting.radius);
  }

  /**
   * Returns nearby notif's title text, who is nearby
   */
  private getNearbyNotifTitle(nearbyFriends: User[]): string {
    const firstFriendFirstName = nearbyFriends[0].name.split(' ')[0];

    if (nearbyFriends.length === 1) {
      return `${firstFriendFirstName} is nearby`;
    } else {
      const moreCount = nearbyFriends.length - 1;
      return `${firstFriendFirstName} +${moreCount} more are nearby`;
    }
  }

  /**
   * Display notif with given text
   */
  private scheduleNotif(title: string) {
    this.localNotifications.schedule({
      text: AppSettings.NOTIF_TEXT,
      title: title,
      sound: null,
      foreground: false,
      sticky: true,
      launch: true,
      lockscreen: false,
    });
  }

}
