import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  user: User;
  subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
    private restService: RestService,
    private navCtrl: NavController) { }

  /**
   * When entering page loading logged in user
   */
  ionViewWillEnter() {
    this.user = this.authService.loggedUser;
  }

  /**
   * When leaving page updating user
   */
  ionViewDidLeave() {
    this.updateUser();
  }

  /**
   * Updating user
   * - in server
   * - in authService (app)
   */
  updateUser() {
    let user: Observable<User> = this.restService.updateUserSettings(this.user.setting);

    console.log('Updating settings');
    const subscription = user.subscribe((user) => {
      console.log(user);
      this.authService.loggedUser = user;
    });
    this.subscription.add(subscription);
  }

  /**
   * Navigating to login and deleting token from storage
   */
  logout() {
    this.authService.token = '';
    this.navCtrl.navigateRoot('');
    console.log('Logging out...');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
