import { Injectable } from '@angular/core';
import { User } from '../models/User';

/**
 * Helper service for storing infos
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private _selectedUser: User;
  private _friends: User[];

  constructor() { }

  set selectedUser(newUser: User) {
    this._selectedUser = newUser;
  }

  get selectedUser(): User {
    return this._selectedUser;
  }

  set friends(newFriends: User[]) {
    this._friends = newFriends;
  }

  get friends(): User[] {
    return this._friends;
  }

}
