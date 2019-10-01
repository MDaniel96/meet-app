import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Location } from 'src/app/models/Location';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent {

  subscription: Subscription = new Subscription();
  friends: Observable<User[]>;

  constructor(
    private restService: RestService,
    private geolocation: Geolocation
  ) { }


  /**
   * - getting user's position
   * - sending position to server
   * - get user's friends
   */
  updateFriendsList() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        let currentLocation = new Location();
        currentLocation.lat = resp.coords.latitude;
        currentLocation.lon = resp.coords.longitude;

        const subscription = this.restService.updateUserLocation(currentLocation)
          .subscribe((user) => {
            console.log('Updating current location...', user);

            this.friends = this.restService.getFriendsList();
            console.log('Getting friends...', this.friends);

          });
        this.subscription.add(subscription);
      })
      .catch((err) => {
        console.log('Error sending current location:', err.message);
        alert('Please add location sharing permission')
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
