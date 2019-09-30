import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { RestService } from 'src/app/services/rest.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  user: User;
  subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private restService: RestService) {
  }

  ionViewWillEnter() {
    this.user = this.authService.loggedUser;
  }

  ionViewDidLeave() {
    this.updateUser();
  }

  updateUser() {
    let user: Observable<User> = this.restService.updateUserSettings(this.user.setting);

    console.log('Updating settings');
    const subscription = user.subscribe((user) => {
      console.log(user);
      this.authService.loggedUser = user;
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
