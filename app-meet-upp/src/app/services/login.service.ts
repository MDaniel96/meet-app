import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/Token';
import { AppSettings } from '../config/AppSettings';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  testLogin(email: string): Observable<Token> {
    return this.http.post<Token>(AppSettings.getBase() + `/login/test/${email}/`, null);
  }

  facebookLogin(facebookToken: string): Observable<Token> {
    return this.http.post<Token>(AppSettings.getBase() + `/login/facebook/${facebookToken}`, null);
  }

  getCurrent(): Observable<User> {
    return this.http.get<User>(AppSettings.getBase() + `/user/current`);
  }

}
