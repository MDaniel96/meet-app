import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  Environment
} from "@ionic-native/google-maps/ngx";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-profile-map',
  templateUrl: './profile-map.component.html',
  styleUrls: ['./profile-map.component.scss'],
})
export class ProfileMapComponent implements OnInit {

  constructor(
    private googleMaps: GoogleMaps,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.initMap();
  }

  initMap() {

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '',
      'API_KEY_FOR_BROWSER_DEBUG': ''
    });

    let map: GoogleMap = GoogleMaps.create('map_canvas');

    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      console.log('map loaded');
      let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);

      let position = {
        target: coordinates,
        zoom: 17
      };

      map.animateCamera(position);

      let markerOptions: MarkerOptions = {
        position: coordinates,
        //icon: "assets/icon/remove-friend-icon.png",
        title: 'Our first POI'
      };

      const marker = map.addMarker(markerOptions)
        .then((marker: Marker) => {
          console.log('marker added');
          marker.showInfoWindow();
        });
    })
  }



}
