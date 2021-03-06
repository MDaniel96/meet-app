import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { AppComponent } from './app.component';
import { TabsPage } from './pages/tabs/tabs.page';
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
import { GlobalService } from './services/global.service';
import { MapService } from './services/map.service';
import { MapButtonsComponent } from './components/map-buttons/map-buttons.component';
import { EventsPage } from './pages/events/events.page';
import { EventItemComponent } from './components/event-item/event-item.component';
import { EventCreatePage } from './pages/event-create/event-create.page';
import { MapComponent } from './components/map/map.component';
import { EventDetailPage } from './pages/event-detail/event-detail.page';
import { EventHeaderComponent } from './components/event-header/event-header.component';
import { DateIconComponent } from './components/date-icon/date-icon.component';
import { CalendarService } from './services/calendar.service';
import { HideHeaderDirective } from './directives/hide-header.directive';
import { SearchItemComponent } from './components/search-item/search-item.component';
import { NotificationService } from './services/notification.service';

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
    BrowserAnimationsModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    AppComponent,
    SearchItemComponent,
    EventHeaderComponent,
    DateIconComponent,
    EventItemComponent,
    MapComponent,
    FriendsComponent,
    RequestsComponent,
    FriendItemComponent,
    AvailabilityMarkerComponent,
    ProfileHeaderComponent,
    MapButtonsComponent,
    TabsPage,
    MainPage,
    SearchPage,
    SettingsPage,
    LoginPage,
    EventDetailPage,
    UserDetailsPage,
    EventsPage,
    EventCreatePage,
    SincePipe,
    DistancePipe,
    HideHeaderDirective
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
    GlobalService,
    GoogleMaps,
    MapService,
    NativePageTransitions,
    InAppBrowser,
    Calendar,
    CalendarService,
    LocalNotifications,
    NotificationService,
    BackgroundMode
  ],
  bootstrap: [AppComponent],
  entryComponents: [EventCreatePage]
})
export class AppModule {}
