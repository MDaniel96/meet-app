import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Storage } from '@ionic/storage';
import { AppSettings } from '../config/AppSettings';
import { Token } from '../models/Token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string = '';
  private _loggedInUser: User;

  constructor(private storage: Storage) { }

  /**
   * Sets and saves token to phone storage
   */
  set token(newToken: string) {
    this._token = newToken;
    this.storage.set(AppSettings.STORAGE_TOKEN_STR, this._token);
  }

  /**
   * Gets token from app memory
   */
  get token(): string {
    return this._token;
  }

  /**
   * Gets token from phone storage and returns it as a Promise
   */
  loadTokenFromStorage(): Promise<string> {
    return this.storage.get(AppSettings.STORAGE_TOKEN_STR);
  }

  set loggedUser(newUser: User) {
    this._loggedInUser = newUser;
  }

  get loggedUser(): User {
    return this._loggedInUser
  }

}
