import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AppSettings } from 'src/app/config/AppSettings';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  user: User;
  locationHeadStr: string = AppSettings.LOC_SHARING;
  locationHeadStatus: string = AppSettings.LOC_ONDWAY;
  locationFootStr: string = '';
  subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private restService: RestService,
    private navCtrl: NavController,
    private geolocation: Geolocation
  ) { }

  /**
   * When entering page loading logged in user, detecting location
   */
  ionViewWillEnter() {
    this.user = this.authService.loggedUser;
    this.detectLocation();
  }

  /**
   * Detecting and displaying location sharing status
   */
  private detectLocation() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        let lat = resp.coords.latitude;
        let lon = resp.coords.longitude;
        console.log('Location detected: ' + lat + ', ' + lon);
        this.locationHeadStatus = AppSettings.LOC_ON;
        this.locationFootStr = `${AppSettings.LOC_SHARING_ON_FOOT}${lat}, ${lon}`;
      })
      .catch((e) => {
        console.log('location detection error: ' + e.message);
        this.locationHeadStatus = AppSettings.LOC_OFF;
        this.locationFootStr = AppSettings.LOC_SHARING_OFF_FOOT;
      })
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

    const subscription = user.subscribe((user) => {
      console.log('Updating settings...', user);
      this.authService.loggedUser = user;
    });
    this.subscription.add(subscription);
  }

  /**
   * Navigating to login and deleting token from storage
   */
  logout() {
    this.authService.token = '';
    this.navCtrl.navigateRoot('/login');
    console.log('Logging out...');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
