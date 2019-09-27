import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string = '';
  private _loggedInUser: User;

  set token(newToken: string) {
    this._token = newToken;
  }

  get token(): string {
    return this._token;
  }

  set loggedUser(newUser: User) {
    this._loggedInUser = newUser;
  }

  get loggedUser(): User {
    return this._loggedInUser
  }

}
