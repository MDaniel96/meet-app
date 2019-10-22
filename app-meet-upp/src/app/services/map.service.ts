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
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: GoogleMap;
  friend: User;
  selectLocationMarker: Marker;

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

  /**
   * Event location selected event
   */
  private locationSelected = new Subject<LatLng>();
  public locationSelected$ = this.locationSelected.asObservable();

  constructor(
    private authService: AuthService,
    private globalService: GlobalService
  ) { }

  /**
   * Creating and initalizing Google Map with one friend
   * @param map GoogleMap object of the component
   * @param subscription components subscriptions
   */
  async createFriendDetailMap(subscription: Subscription) {
    this.friend = this.globalService.selectedUser;
    await this.createMap(AppSettings.MAP_CANVAS_FRIEND);

    await this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addDragEventListener(subscription);
      this.addMarkerToUser(this.authService.loggedUser, AppSettings.MAP_MY_LOCATION_URL);
      this.addMarkerToUser(this.friend, this.friend.image);
      this.moveCameraToUser(this.map, this.friend, true);
    });
    return this.map;
  }

  /**
   * Creating and initalizing Google Map to select location
   * @param map GoogleMap object of the component
   * @param subscription components subscriptions
   */
  async createSelectLocationMap(subscription: Subscription) {
    await this.createMap(AppSettings.MAP_CANVAS_SELECT);

    await this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addClickEventListener(subscription);
      this.addMarkerToUser(this.authService.loggedUser, AppSettings.MAP_MY_LOCATION_URL);
      this.moveCameraToUser(this.map, this.authService.loggedUser);
    });
    return this.map;
  }

  /**
   * Creates map
   */
  private async createMap(canvasId: string) {
    this.setDefaultBrowserEnv();
    this.map = GoogleMaps.create(
      canvasId,
      { styles: this.getMapStyle() }
    );
  }

  /**
   * Returns friends location
   */
  getFriendLocation(): Location {
    return this.friend.location;
  }

  /**
   * Animate to friend on given map
   */
  animateToFriend(map: GoogleMap) {
    this.moveCameraToUser(map, this.friend, true);
    this.friendCentered.next();
  }

  /**
   * Animate to user on given map
   */
  animateToUser(map: GoogleMap) {
    this.moveCameraToUser(map, this.authService.loggedUser, true);
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

  /**
   * Adds and subscribes to event listener when clicked
   */
  private addClickEventListener(subscription: Subscription) {
    const sub = this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data: any[]) => {
      let position: LatLng = data[0];
      this.locationSelected.next(position);
      this.selectLocationMarker.remove();
      this.addMarker(position, AppSettings.MAP_EVENT_LOCATION_URL);
    });
    subscription.add(sub);
  }

  /**
   * Adds marker to user with given image
   */
  private addMarkerToUser(user: User, url: string) {
    let coords = this.getUserCoords(user);
    this.addMarker(coords, url);
  }

  /**
   * Add marker to given position and img
   */
  private addMarker(coords: LatLng, url: string) {
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
        this.selectLocationMarker = marker;
      });
  }

  /**
   * Moves camera to user, animates if animate is set
   */
  private moveCameraToUser(map: GoogleMap, user: User, animate?: boolean) {
    let coords: LatLng = this.getUserCoords(user);
    let animationOptions = {
      target: coords,
      zoom: AppSettings.MAP_USER_ZOOM,
      duration: AppSettings.MAP_ANIMATION_SPEED_MILISEC
    };
    if (animate) {
      map.animateCamera(animationOptions);
    } else {
      map.moveCamera(animationOptions);
    }
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
