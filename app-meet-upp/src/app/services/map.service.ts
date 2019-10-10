import { Injectable } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  Environment
} from "@ionic-native/google-maps/ngx";
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { AppSettings } from '../config/AppSettings';
import { Subscription, Subject } from 'rxjs';

// TODO: ez még nagyon rusnya osztály, rendbe kell tenni
@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: GoogleMap;
  friend: User;

  private mapDragged = new Subject<void>();
  public mapDragged$ = this.mapDragged.asObservable();

  constructor(
    private authService: AuthService
  ) { }

  /**
   * Creating and initalizing Google Map
   * @param map GoogleMap object of the component
   * @param friend user's friend
   * @param subscription components subscriptions
   */
  async initMapWithFriend(map: GoogleMap, friend: User, subscription: Subscription) {
    this.map = map;
    this.friend = friend;

    this.setDefaultBrowserEnv();
    this.map = GoogleMaps.create(AppSettings.MAP_CANVAS_ID);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addDragEventListener(subscription);
      let user: User = this.authService.loggedUser;
      this.addMarkerToUser(user);
      this.addMarkerToUser(this.friend);
      this.moveCameraToUser(this.friend);
    });

  }

  /**
   * When profile header clicked navigating to friend
   */
  headerClicked() {
    this.moveCameraToUser(this.friend);
  }

  /**
   * Adds and subscribes to event listener when drag
   */
  private addDragEventListener(subscription: Subscription) {
    const sub = this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(() => {
      this.mapDragged.next();
    });
    subscription.add(sub);
  }

  private addMarkerToUser(user: User) {
    let coords = this.getUserCoords(user);
    let markerOptions: MarkerOptions = {
      position: coords,
      icon: {
        url: user.image,
        size: {
          width: AppSettings.MAP_ICON_SIZE,
          height: AppSettings.MAP_ICON_SIZE
        }
      }
    };
    this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        marker.showInfoWindow();
      });
  }

  private moveCameraToUser(user: User) {
    let coords: LatLng = this.getUserCoords(user);
    let animationOptions = {
      target: coords,
      zoom: AppSettings.MAP_USER_ZOOM,
      duration: AppSettings.MAP_ANIMATION_SPEED_MILISEC
    };

    this.map.animateCamera(animationOptions);
  }

  /**
   * Getting users coordinatas 
   */
  private getUserCoords(user: User): LatLng {
    return new LatLng(user.location.lat, user.location.lon);
  }

  /**
   * Set Environment so browser can run map
   */
  private setDefaultBrowserEnv() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '',
      'API_KEY_FOR_BROWSER_DEBUG': ''
    });
  }

}
