import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Subject } from 'rxjs';
import { Event } from '../models/Event';
import { UserComment } from '../models/UserComment';

/**
 * Helper service for storing infos
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  /**
   * Stores last selected user
   */
  private _selectedUser: User;

  /**
   * Stores last selected event
   */
  private _selectedEvent: Event;

  /**
   * Can only be read once
   */
  private _preselectedUser: User;

  /**
   * Stores last selected friends
   */
  private _friends: User[];

  /**
   * Stores last selected event users
   */
  private _eventUsers: UserComment[];

  /**
   * Event created event
   */
  private eventCreated = new Subject<void>();
  public eventCreated$ = this.eventCreated.asObservable();

  constructor() { }

  set selectedUser(newUser: User) {
    this._selectedUser = newUser;
  }

  get selectedUser(): User {
    return this._selectedUser;
  }

  set selectedEvent(newEvent: Event) {
    this._selectedEvent = newEvent;
  }

  get selectedEvent(): Event {
    return this._selectedEvent;
  }
  
  set preselectedUser(newUser: User) {
    this._preselectedUser = newUser;
  }

  get preselectedUser(): User {
    let user = this._preselectedUser;
    this._preselectedUser = null;
    return user;
  }

  set friends(newFriends: User[]) {
    this._friends = newFriends;
  }

  get friends(): User[] {
    return this._friends;
  }

  set eventUsers(newEventUsers: UserComment[]) {
    this._eventUsers = newEventUsers;
  }

  get eventUsers(): UserComment[] {
    return this._eventUsers;
  }

  creatingEvent() {
    this.eventCreated.next();
  }

}
