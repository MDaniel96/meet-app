import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Location } from 'src/app/models/Location';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingAnimationService } from 'src/app/services/loading.service';
import { AppSettings } from 'src/app/config/AppSettings';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent {

  subscription: Subscription = new Subscription();

  friends: User[];
  nearbyFriends: User[];
  otherFriends: User[];

  constructor(
    private restService: RestService,
    private geolocation: Geolocation,
    private authService: AuthService,
    private loadingAnimation: LoadingAnimationService
  ) {
  }

  /**
   * Refresh list and location by pulling list
   */
  refreshFriends(event) {
    console.log('refreshing list..');
    this.updateLocationAndFriendsList(event);
  }

  /**
   * - getting user's position
   * - sending position to server
   * - get user's friends
   * @param refreshEvent refresh-item's event
   */
  updateLocationAndFriendsList(refreshEvent?: any) {
    this.loadingAnimation.presentLoading(AppSettings.UPDATING_LOCATION);
    // Getting location
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        let currentLocation = new Location();
        currentLocation.lat = resp.coords.latitude;
        currentLocation.lon = resp.coords.longitude;
        console.log('Getting current location...', currentLocation.lat + ', ' + currentLocation.lon);
        // Updating location
        const subscription = this.restService.updateUserLocation(currentLocation)
          .subscribe((user) => {
            console.log('Updating current location...', user);
            this.authService.loggedUser = user;
            // Getting friend list
            this.getFriendLists(refreshEvent, false);
          });
        this.subscription.add(subscription);
      })
      .catch((err) => {
        console.log('Error sending current location:', err.message);
        alert('Please add location sharing permission')
      });
  }

  /**
   * Getting user's friends
   * @param refreshEvent if refreshed by refreshed item
   * @param noLocationUpdate location is updated too, or just friend list
   */
  getFriendLists(refreshEvent: any, noLocationUpdate: boolean) {
    if (noLocationUpdate) {
      console.log('Getting friends without loc update...');
      this.loadingAnimation.presentLoading(AppSettings.LOADING_FRIENDS);
    }
    const subscription = this.restService.getFriendsList()
      .subscribe((friends) => {
        this.friends = friends;
        console.log('Getting friends...', this.friends);
        this.getNearbyFriends();
        this.getOtherFriends();
        this.loadingAnimation.dismissLoading();
        if (refreshEvent) {
          refreshEvent.target.complete();
        }
      });
    this.subscription.add(subscription);
  }

  /**
   * Getting friends who are within radius
   */
  private getNearbyFriends() {
    let radius = this.authService.loggedUser.setting.radius;
    this.nearbyFriends = this.friends.filter(friend =>
      friend.distance <= radius);
  }

  /**
   * Getting friends who are out of radius
   */
  private getOtherFriends() {
    let radius = this.authService.loggedUser.setting.radius;
    this.otherFriends = this.friends.filter(friend =>
      friend.distance > radius);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
