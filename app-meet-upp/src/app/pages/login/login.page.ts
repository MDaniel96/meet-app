import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Observable, Subscription } from 'rxjs';
import { Token } from 'src/app/models/Token';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { AppSettings } from 'src/app/config/AppSettings';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = AppSettings.DEFAULT_EMAIL;
  token: Observable<Token>;
  subscription: Subscription = new Subscription();

  constructor(private loginService: LoginService,
    private authService: AuthService,
    private navCtrl: NavController) { }

  /**
   * Test login with email
   * - saves user and token
   * - navigates to /tabs page
   */
  testLogin() {
    event.preventDefault();

    this.token = this.loginService.testLogin(this.email);
    const subscription = this.token.subscribe(res => {

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
