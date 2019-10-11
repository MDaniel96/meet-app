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
import { darkMapStyle } from '../config/DarkMapStyle';
import { Location } from '../models/Location';

// TODO: ez még nagyon rusnya osztály, rendbe kell tenni
@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: GoogleMap;
  friend: User;

  /**
   * Map dragged event
   */
  private mapDragged = new Subject<void>();
  public mapDragged$ = this.mapDragged.asObservable();

  /**
   * Friend centered event
   */
  private friendCentered = new Subject<void>();
  public friendCentered$ = this.friendCentered.asObservable();

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

    this.map = GoogleMaps.create(
      AppSettings.MAP_CANVAS_ID,
      { styles: this.getMapStyle() }
    );

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addDragEventListener(subscription);
      let user: User = this.authService.loggedUser;
      this.addMarkerToUser(user, AppSettings.MAP_MY_LOCATION_ICON);
      this.addMarkerToUser(this.friend, this.friend.image);
      this.moveCameraToUser(this.friend);
    });
  }

  /**
   * Returns friends location
   */
  getFriendLocation(): Location {
    return this.friend.location;
  }

  /**
   * Animate to friend
   */
  animateToFriend() {
    this.moveCameraToUser(this.friend);
    this.friendCentered.next();
  }

  /**
   * Animate to user
   */
  animateToUser() {
    this.moveCameraToUser(this.authService.loggedUser);
  }

  /**
   * Returns dark mode map style if dark mode is set
   */
  private getMapStyle() {
    if (this.authService.loggedUser.setting.nightMode) {
      return darkMapStyle;
    }
    return [];
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

  private addMarkerToUser(user: User, url: string) {
    let coords = this.getUserCoords(user);
    let markerOptions: MarkerOptions = {
      position: coords,
      icon: {
        url: url,
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

  /**
   * Animates camera to user
   */
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
