import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { Platform } from '@ionic/angular';
import { MapService } from 'src/app/services/map.service';
import { GoogleMap } from '@ionic-native/google-maps/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-map',
  templateUrl: './profile-map.component.html',
  styleUrls: ['./profile-map.component.scss'],
})
export class ProfileMapComponent implements OnInit {

  @Input() user: User;

  map: GoogleMap;
  subscription: Subscription = new Subscription();

  constructor(
    private platform: Platform,
    private mapService: MapService
  ) { }

  /**
   * Creating map
   */
  async ngOnInit() {
    await this.platform.ready();
    await this.mapService.initMapWithFriend(this.map, this.user, this.subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
