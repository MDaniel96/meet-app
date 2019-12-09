import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/notification.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  subscription: Subscription = new Subscription();

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.authService.loadPreviousUserSession(this.subscription);
      this.notificationService.start(this.subscription);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
