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
import { UserComment } from '../models/UserComment';
import { Comment } from '../models/Comment';

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

  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(this.BASE + `/user/friend/request/all`);
  }

  acceptFriendRequest(requestId: string): Observable<string> {
    return this.http.post<string>(this.BASE + `/user/friend/request/accept/${requestId}`, null);
  }

  cancelFriendRequest(requestId: string): Observable<string> {
    return this.http.delete<string>(this.BASE + `/user/friend/request/cancel/${requestId}`);
  }

  deleteFriendship(userId: string): Observable<User> {
    return this.http.delete<User>(this.BASE + `/user/friend/${userId}`);
  }

  getEventList(): Observable<Event[]> {
    return this.http.get<Event[]>(this.BASE + `/user/event/all`);
  }

  addNewEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.BASE + `/user/event`, event);
  }

  addFriendsToEvent(eventId: string, friends: User[]): Observable<Event> {
    return this.http.post<Event>(this.BASE + `/user/event/${eventId}/addFriends`, friends);
  }

  deleteEvent(eventId: string): Observable<Event> {
    return this.http.delete<Event>(this.BASE + `/user/event/${eventId}`);
  }

  getEventsUserComments(eventId: string): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.BASE + `/user/event/${eventId}/users`);
  }

  addCommentToEvent(eventId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(this.BASE + `/user/event/${eventId}/comment/${text}`, null);
  }

  searchMyFriends(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(this.BASE + `/user/search/my/${keyword}`);
  }

  searchOthers(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(this.BASE + `/user/search/other/${keyword}`);
  }

  searchMyEvents(keyword: string): Observable<Event[]> {
    return this.http.get<Event[]>(this.BASE + `/user/event/search/my/${keyword}`);
  }

  searchOtherEvents(keyword: string): Observable<Event[]> {
    return this.http.get<Event[]>(this.BASE + `/user/event/search/other/${keyword}`);
  }

}
