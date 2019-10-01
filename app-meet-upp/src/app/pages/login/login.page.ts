import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Observable, Subscription } from 'rxjs';
import { Token } from 'src/app/models/Token';
import { AuthService } from 'src/app/services/auth.service';
import { AppSettings } from 'src/app/config/AppSettings';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = AppSettings.DEFAULT_EMAIL;
  subscription: Subscription = new Subscription();

  constructor(
    private restService: RestService,
    private authService: AuthService,
    private fb: Facebook
  ) { }

  /**
   * Test login with email
   * - gets then processes user's token from email
   */
  testLogin() {
    event.preventDefault();
    let token: Observable<Token> = this.restService.testLogin(this.email);
    this.authService.processToken(token, this.subscription);
  }

  /**
   * Log in with fb
   * - asks for permissions and gets fb's access token
   * - gets then processes user's token from access token
   */
  facebookLogin() {
    this.fb.login(AppSettings.FACEBOOK_PERMISSIONS)
      .then((res: FacebookLoginResponse) => {

        if (res.status == "connected") {
          let fbAccessToken = res.authResponse.accessToken;
          let token: Observable<Token> = this.restService.facebookLogin(fbAccessToken);
          this.authService.processToken(token, this.subscription);

        } else {
          console.log("Error: Logging in to facebook.");
        }
      })
      .catch((e) => {
        console.log('Error logging into Facebook', e);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
