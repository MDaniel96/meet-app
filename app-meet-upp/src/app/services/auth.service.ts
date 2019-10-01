import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Storage } from '@ionic/storage';
import { AppSettings } from '../config/AppSettings';
import { Token } from '../models/Token';
import { Observable, Subscription, of } from 'rxjs';
import { RestService } from './rest.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string = '';
  private _loggedInUser: User;

  constructor(
    private storage: Storage,
    private restService: RestService,
    private navCtrl: NavController
  ) { }

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

  set loggedUser(newUser: User) {
    this._loggedInUser = newUser;
  }

  get loggedUser(): User {
    return this._loggedInUser
  }

  /**
   * Loading token from storage and processing it
   * @param subscription page's subscriptions
   */
  loadPreviousUserSession(subscription: Subscription) {
    this.storage.get(AppSettings.STORAGE_TOKEN_STR)
      .then((token) => {
        this.processToken(of({
          token: token
        }), subscription);
      });
  }

  /**
   * Gets and saves app token and logged in user
   * - navigates to /tabs page if token is ok
   * - if there's no, or empty token, navigates to /login
   * - subscribes to subscriptions
   * @param token app token
   * @param subscription page's managed subscriptions
   */
  processToken(token: Observable<Token>, subscription: Subscription) {
    const sub = token.subscribe(res => {
      console.log('Logging in...')
      console.log('App token: ' + res.token);
      this.token = res.token;

      if (res.token != null && res.token !== '') {
        subscription.add(
          this.restService.getCurrentUser().subscribe((user) => {
            console.log(user);
            this.loggedUser = user;
            this.navCtrl.navigateRoot('/tabs');
          })
        );
      } else {
        this.navCtrl.navigateRoot('/login');
      }

    });
    subscription.add(sub);
  }

}
