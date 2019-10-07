import { Injectable } from '@angular/core';
import { User } from '../models/User';

/**
 * Helper service for storing selected user
 */
@Injectable({
  providedIn: 'root'
})
export class SelectedUserService {

  private _selectedUser: User;

  constructor() { }

  set selectedUser(newUser: User) {
    this._selectedUser = newUser;
  }

  get selectedUser(): User {
    return this._selectedUser;
  }

}
