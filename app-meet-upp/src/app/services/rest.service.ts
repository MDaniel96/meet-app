import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/Token';
import { AppSettings } from '../config/AppSettings';
import { User } from '../models/User';
import { Setting } from '../models/Settings';
import { Location } from '../models/Location';

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

}
