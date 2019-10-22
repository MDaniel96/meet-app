import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Subject } from 'rxjs';

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
   * Can only be read once
   */
  private _preselectedUser: User;

  /**
   * Stores last selected friends
   */
  private _friends: User[];

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

  creatingEvent() {
    this.eventCreated.next();
  }

}
