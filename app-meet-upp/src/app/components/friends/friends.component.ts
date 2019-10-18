import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Location } from 'src/app/models/Location';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingAnimationService } from 'src/app/services/loading.service';
import { AppSettings } from 'src/app/config/AppSettings';
import { GlobalService } from 'src/app/services/selected-user.service';

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

  refreshLocationEvent: any;

  constructor(
    private restService: RestService,
    private geolocation: Geolocation,
    private authService: AuthService,
    private loadingAnimation: LoadingAnimationService,
    private globalService: GlobalService
  ) {
  }

  /**
   * Ion-refresh event handle
   */
  refreshFriends(event) {
    console.log('Refreshing friends...');
    this.refreshLocationEvent = event;
    this.getFriendListWithLocationUpdate();
  }

  /**
   * - getting user's position
   * - sending position to server
   * - get user's friends
   */
  getFriendListWithLocationUpdate() {
    this.loadingAnimation.presentLoading(AppSettings.UPDATING_LOCATION);
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        let currentLocation = this.parseLocationResponse(resp);
        const subscription = this.restService.updateUserLocation(currentLocation)
          .subscribe((user) => {
            console.log('Updating current location...', user);
            this.authService.loggedUser = user;
            this.getFriendList(false);
          });
        this.subscription.add(subscription);
      })
      .catch((err) => {
        this.showNoLocPermissionMessage(err);
      });
  }

  /**
   * Getting user's friends with animations
   * @param refreshEvent ion-refresher's refresh event
   * @param withoutLocationUpdate flag whether location is updated too, or just friends
   */
  getFriendList(withoutLocationUpdate: boolean) {
    this.startNoLocUpdateAnimation(withoutLocationUpdate);
    const subscription = this.restService.getFriendsList()
      .subscribe((friends) => {
        this.friends = friends;
        this.globalService.friends = friends;
        console.log('Getting friends...', this.friends);
        this.sortFriends();
        this.stopLoadingAnimations();
      });
    this.subscription.add(subscription);
  }


  /**
   * Parsing location response
   */
  private parseLocationResponse(resp): Location {
    let currentLocation = new Location();
    currentLocation.lat = resp.coords.latitude;
    currentLocation.lon = resp.coords.longitude;
    console.log('Getting current location...', currentLocation.lat + ', ' + currentLocation.lon);
    return currentLocation;
  }

  /**
   * Showing no location permission error messages
   */
  private showNoLocPermissionMessage(err) {
    console.log('Error sending current location:', err.message);
    alert('Please add location sharing permission')
  }

  /**
   * Start no location update animation
   */
  private startNoLocUpdateAnimation(noLocationUpdate: boolean) {
    if (noLocationUpdate) {
      console.log('Getting friends without loc update...');
      this.loadingAnimation.presentLoading(AppSettings.LOADING_FRIENDS);
    }
  }

  /**
   * Stop loading anim and pull refresh
   */
  private stopLoadingAnimations() {
    this.loadingAnimation.dismissLoading();
    if (this.refreshLocationEvent) {
      this.refreshLocationEvent.target.complete();
      this.refreshLocationEvent = null;
    }
  }

  /**
   * Sort friends
   */
  private sortFriends() {
    this.getNearbyFriends();
    this.getOtherFriends();
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
