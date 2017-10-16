import { Component } from '@angular/core';
import {Location} from "../../models/location";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})

export class SetLocationPage {
  location: Location;
  marker: Location;

  constructor(private navParam: NavParams) {
    this.location = this.navParam.get('location');
  }

  onSetMarker(event: any) {
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }
}
