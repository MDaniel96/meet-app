import { Component, OnInit, Input } from '@angular/core';
import { GoogleMap } from '@ionic-native/google-maps/ngx';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { MapService } from 'src/app/services/map.service';
import { MapType } from 'src/app/models/MapType';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @Input() mapType: MapType;

  map: GoogleMap;
  subscription: Subscription = new Subscription();

  constructor(
    private platform: Platform,
    private mapService: MapService
  ) { }

  /**
   * Init and save map according to its type
   */
  async ngOnInit() {
    await this.platform.ready();

    if (this.mapType === MapType.select) {
      this.mapService.createSelectLocationMap(this.subscription)
        .then((map) => {
          this.map = map;
        });
    } else
      if (this.mapType === MapType.friend) {
        await this.mapService.createFriendDetailMap(this.subscription)
          .then((map) => {
            this.map = map;
          });
      } else
        if (this.mapType === MapType.event) {
          await this.mapService.createEventDetailMap(this.subscription)
            .then((map) => {
              this.map = map;
            });
        }
  }

  /**
   * Animate camera to friend
   */
  animateToFriend() {
    this.mapService.animateToFriend(this.map);
  }

  /**
   * Animate camera to event
   */
  animateToEvent() {
    this.mapService.animateToEvent(this.map);
  }

  /**
   * Animate camera to user
   */
  animateToUser() {
    this.mapService.animateToUser(this.map);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
