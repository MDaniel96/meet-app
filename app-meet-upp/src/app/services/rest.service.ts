import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/Token';
import { AppSettings } from '../config/AppSettings';
import { User } from '../models/User';
import { Setting } from '../models/Settings';
import { Location } from '../models/Location';
import { FriendshipStatus } from '../models/FriendshipStatus';
import { FriendRequest } from '../models/FriendRequest';
import { Event } from '../models/Event';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private BASE: string;

  constructor(private http: HttpClient) {
    this.BASE = AppSettings.getBase();
  }

  testLogin(email: string): Observable<Token> {
    return this.http.post<Token>(this.BASE + `/login/test/${email}/`, null);
  }

  facebookLogin(facebookToken: string): Observable<Token> {
    return this.http.post<Token>(this.BASE + `/login/facebook/${facebookToken}`, null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.BASE + `/user/current`);
  }

  updateUserSettings(body: Setting): Observable<User> {
    return this.http.put<User>(this.BASE + `/user/settings`, body);
  }

  updateUserLocation(body: Location): Observable<User> {
    return this.http.put<User>(this.BASE + `/user/location`, body);
  }

  getFriendsList(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE + `/user/friend/all`);
  }

  getFriendshipStatus(userId: string): Observable<FriendshipStatus> {
    return this.http.get<FriendshipStatus>(this.BASE + `/user/friend/${userId}/status`);
  }

  addFriendRequest(userId: string): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(this.BASE + `/user/friend/request/${userId}`, null);
  }

  deleteFriendship(userId: string): Observable<User> {
    return this.http.delete<User>(this.BASE + `/user/friend/${userId}`);
  }

  getEventList(): Observable<Event[]> {
    return this.http.get<Event[]>(this.BASE + `/user/event/all`);
  }

  addNewEvent(): Observable<Event> {

    let date: Date = new Date();

    date.setFullYear(2019);
    date.setMonth(9);
    date.setDate(16);

    date.setHours(15);
    date.setMinutes(55);

    const body: Event = {
      id: '1333',
      name: 'Jövő október',
      time: date,
      location: null,
      peopleCount: 9,
      public: false
    }

    return this.http.post<Event>(this.BASE + `/user/event`, body);
  }

  deleteEvent(eventId: string): Observable<Event> {
    return this.http.delete<Event>(this.BASE + `/user/event/${eventId}`);
  }

}
