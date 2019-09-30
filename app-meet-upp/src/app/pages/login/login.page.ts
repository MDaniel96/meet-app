import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Observable, Subscription } from 'rxjs';
import { Token } from 'src/app/models/Token';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
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

  constructor(private loginService: LoginService,
    private authService: AuthService,
    private navCtrl: NavController,
    private fb: Facebook) { }

  /**
   * Test login with email
   * - gets then processes user's token from email
   */
  testLogin() {
    event.preventDefault();
    let token: Observable<Token> = this.loginService.testLogin(this.email);
    this.processToken(token);
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
          let token: Observable<Token> = this.loginService.facebookLogin(fbAccessToken);
          this.processToken(token);

        } else {
          console.log("Error: Logging in to facebook.");
        }
      })
      .catch((e) => {
        console.log('Error logging into Facebook', e);
      });
  }

  /**
   * Gets and saves app token and logged in user
   * - navigates to /tabs page 
   * @param token app token
   */
  private processToken(token: Observable<Token>) {
    const subscription = token.subscribe(res => {
      console.log('App token: ' + res.token);
      this.authService.token = res.token;

      if (res.token != null) {
        this.subscription.add(
          this.loginService.getCurrent().subscribe((user) => {
            console.log(user);
            this.authService.loggedUser = user;
            this.navCtrl.navigateRoot('/tabs');
          })
        );
      }
      
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
