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
import { UserComment } from '../models/UserComment';
import { Event } from '../models/Event';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: GoogleMap;
  friend: User;
  selectLocationMarker: Marker;
  eventUsers: UserComment[];
  event: Event;
  userMarker: Marker;

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
   * Event centered event
   */
  private eventCentered = new Subject<void>();
  public eventCentered$ = this.eventCentered.asObservable();

  /**
   * Event location selected event
   */
  private locationSelected = new Subject<LatLng>();
  public locationSelected$ = this.locationSelected.asObservable();

  /**
   * Marker clicked event with given user
   */
  private markerClicked = new Subject<User | Event>();
  public markerClicked$ = this.markerClicked.asObservable();

  constructor(
    private authService: AuthService,
    private globalService: GlobalService
  ) { }

  /**
   * Creating and initalizing Google Map with one friend
   * @param subscription components subscriptions
   */
  async createFriendDetailMap(subscription: Subscription) {
    this.friend = this.globalService.selectedUser;
    await this.createMap(AppSettings.MAP_CANVAS);

    await this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addDragEventListener(subscription);
      this.addMarkerToObj(this.authService.loggedUser, AppSettings.MAP_MY_LOCATION_URL);
      this.addMarkerToObj(this.friend, this.friend.image);
      this.moveCameraToObj(this.map, this.friend, true);
    });
    return this.map;
  }

  /**
   * Creating and initalizing Google Map to select location
   * @param subscription components subscriptions
   */
  async createSelectLocationMap(subscription: Subscription) {
    await this.createMap(AppSettings.MAP_CANVAS);

    await this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addClickEventListener(subscription);
      this.addMarkerToObj(this.authService.loggedUser, AppSettings.MAP_SELECT_LOCATION_URL);
      this.moveCameraToObj(this.map, this.authService.loggedUser);
    });
    return this.map;
  }

  /**
   * Creating and initalizing Google Map with event detail
   * @param subscription components subscriptions
   */
  async createEventDetailMap(subscription: Subscription) {
    this.eventUsers = this.globalService.eventUsers;
    this.event = this.globalService.selectedEvent;
    await this.createMap(AppSettings.MAP_CANVAS);

    await this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.addDragEventListener(subscription);

      this.addMarkerToObj(this.event, AppSettings.MAP_EVENT_LOCATION_URL);
      this.moveCameraToObj(this.map, this.event, true, AppSettings.MAP_EVENT_ZOOM);

      this.eventUsers.forEach((userComment) => {
        if (userComment.user.id !== this.authService.loggedUser.id) {
          this.addMarkerToObj(userComment.user, userComment.user.image, userComment.comment, subscription);
        } else {
          this.addMarkerToObj(this.authService.loggedUser, AppSettings.MAP_MY_LOCATION_URL,
            userComment.comment, subscription);
        }
      });
      
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
    this.moveCameraToObj(map, this.friend, true);
    this.friendCentered.next();
  }

  /**
   * Animate to event on given map
   */
  animateToEvent(map: GoogleMap) {
    this.moveCameraToObj(map, this.event, true, AppSettings.MAP_EVENT_ZOOM);
    this.eventCentered.next();
  }

  /**
   * Animate to user on given map
   */
  animateToUser(map: GoogleMap) {
    this.moveCameraToObj(map, this.authService.loggedUser, true);
  }

  /**
   * Refreshing map with logged in user's markers text
   */
  setUserComment(text: string) {
    this.userMarker.setTitle(text);
  }

  /**
   * Refreshing map with added friends
   */
  setAddedFriends(friends: User[], subscription: Subscription) {
    friends.forEach(friend => 
      this.addMarkerToObj(friend, friend.image, null, subscription)
    );
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
      this.addMarker(position, AppSettings.MAP_SELECT_LOCATION_URL);
    });
    subscription.add(sub);
  }

  /**
   * Adds click listener to marker. If clicked displaying user header
   */
  private addMarkerListener(marker: Marker, user: User | Event, comment: Comment, subscription: Subscription) {
    if (user && subscription) {
      let sub = marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.markerClicked.next(user);
      });
      subscription.add(sub);
    }
  }

  /**
   * Saving logged in user's marker
   */
  private saveLoggedInUsersMarker(marker: Marker, user: User | Event) {
    if (user && user.location === this.authService.loggedUser.location) {
      this.userMarker = marker;
    }
  }

  /**
   * Adds marker to user with given image
   */
  private addMarkerToObj(obj: User | Event, url: string, comment?: Comment, subscription?: Subscription) {
    let coords = this.getCoords(obj);
    this.addMarker(coords, url, obj, comment, subscription);
  }

  /**
   * Add marker to given position and img
   */
  private addMarker(coords: LatLng, url: string, user?: User | Event, comment?: Comment, subscription?: Subscription) {
    let markerOptions: MarkerOptions = {
      title: comment ? comment.text : null,
      position: coords,
      icon: {
        url: url,
        size: {
          width: AppSettings.MAP_ICON_SIZE,
          height: AppSettings.MAP_ICON_SIZE
        },
      }
    };
    this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        this.selectLocationMarker = marker;
        this.addMarkerListener(marker, user, comment, subscription);
        this.saveLoggedInUsersMarker(marker, user);
      });
  }


  /**
   * Moves camera to user, animates if animate is set
   */
  private moveCameraToObj(map: GoogleMap, obj: User | Event, animate?: boolean, zoom?: number) {
    let coords: LatLng = this.getCoords(obj);
    let animationOptions = {
      target: coords,
      zoom: zoom ? zoom : AppSettings.MAP_USER_ZOOM,
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
  private getCoords(obj: User | Event): LatLng {
    return new LatLng(obj.location.lat, obj.location.lon);
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
