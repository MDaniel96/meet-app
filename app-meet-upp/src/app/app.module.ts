import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';

import { AppComponent } from './app.component';
import { TabsPage } from './pages/tabs/tabs.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './pages/tabs/tabs.router.module';
import { MainPage } from './pages/main/main.page';
import { SearchPage } from './pages/search/search.page';
import { SettingsPage } from './pages/settings/settings.page';
import { LoginPage } from './pages/login/login.page';
import { RestService } from './services/rest.service';
import { TokenInterceptor } from './services/tokenInterceptor';
import { AuthService } from './services/auth.service';
import { DistancePipe } from './pipes/distance.pipe';
import { FriendsComponent } from './components/friends/friends.component';
import { RequestsComponent } from './components/requests/requests.component';
import { FriendItemComponent } from './components/friend-item/friend-item.component';
import { SincePipe } from './pipes/since.pipe';
import { AvailabilityMarkerComponent } from './components/availability-marker/availability-marker.component';
import { LoadingAnimationService } from './services/loading.service';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { UserDetailsPage } from './pages/user-details/user-details.page';
import { SelectedUserService } from './services/selected-user.service';
import { ProfileMapComponent } from './components/profile-map/profile-map.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    AppComponent,
    TabsPage,
    MainPage,
    SearchPage,
    SettingsPage,
    LoginPage,
    DistancePipe,
    FriendsComponent,
    RequestsComponent,
    FriendItemComponent,
    SincePipe,
    AvailabilityMarkerComponent,
    ProfileHeaderComponent,
    UserDetailsPage,
    ProfileMapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RestService,
    AuthService,
    Facebook,
    Geolocation,
    LoadingAnimationService,
    SelectedUserService,
    GoogleMaps
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
