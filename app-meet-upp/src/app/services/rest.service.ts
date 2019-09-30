import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/Token';
import { AppSettings } from '../config/AppSettings';
import { User } from '../models/User';
import { Setting } from '../models/Settings';
import { TravelMode } from '../models/TravelMode';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  testLogin(email: string): Observable<Token> {
    return this.http.post<Token>(AppSettings.getBase() + `/login/test/${email}/`, null);
  }

  facebookLogin(facebookToken: string): Observable<Token> {
    return this.http.post<Token>(AppSettings.getBase() + `/login/facebook/${facebookToken}`, null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(AppSettings.getBase() + `/user/current`);
  }

  updateUserSettings(body: Setting): Observable<User> {
    return this.http.put<User>(AppSettings.getBase() + `/user/settings`, body);
  }

}
