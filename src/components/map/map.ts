import {Component, Injectable} from "@angular/core";
import {GeoLocComponent} from "../geo-loc/geo-loc";
import {isDefined} from "ionic-angular/util/util";
import {MarkersComponent} from "../markers/markers";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Geoposition} from "@ionic-native/geolocation";
import * as L from "leaflet";
import {CRMarker} from "../markers/crMarker";
import {Subject} from "rxjs/Subject";
import {LocEditPage} from "../../pages/loc-edit/loc-edit";
import {App} from "ionic-angular";

/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Injectable()
@Component({
  selector: 'cr-map',
  templateUrl: 'map.html'
})
export class MapComponent {

  /** Holds the current zoom for the map. */
  zoomLevel: number;
  map: any;
  lastPosition: [number, number];
  private autoCenter: boolean = false;
  markerEventSubject: Subject<CRMarker>;
  locationMap = {};

  constructor(
    public geoLoc: GeoLocComponent,
    private markers: MarkersComponent,
    public splashScreen: SplashScreen,
    public appCtrl: App
  ) {
    this.zoomLevel = 14;
    this.lastPosition = [33.77, -84.37];
  }

  public setWatch() {
    console.log('Setting Watch for current position');

    this.geoLoc.getPositionWatch().subscribe(
      (position) => {

        this.markers.updateCurrentLocationMarker(position.coords);

        /* Save for later. */
        this.lastPosition = [
          position.coords.latitude,
          position.coords.longitude
        ];

        /* Move map so current location is centered. */
        if (this.autoCenter) {
          this.map.panTo(this.lastPosition);
        }
      }
    );

  }

  /**
   * @ngDoc
   * Prepares the Leaflet map to be shown, initializing leaflet if not already initialized.
   * Source of position info should be settled prior to calling this function.
   */
  public openMap(
    position: Geoposition,
  ) {
    /* If map is already initialized, no need to re-initialize. */
    if (!this.map) {
      console.log('MapComponent Initializing');
      this.locationMap = {};
      this.map = L.map('map');
    }

    /* Assemble Leaflet position object. */
    let leafletPosition = [
      position.coords.latitude,
      position.coords.longitude
    ];

    this.map.setView(leafletPosition, this.zoomLevel);

    /* Specify the tile layer for the map and add the attribution. */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(this.map);

    /* Add a "here I am" marker. */
    this.markers.getHereIAmMarker(leafletPosition).addTo(this.map);

    /* Set map to update when position changes. */
    this.setWatch();

    /* Map is ready; turn off splash screen. */
    this.splashScreen.hide();

  }

  public closeMap() {
    if (isDefined(this.map) && this.map !== null) {
      this.geoLoc.clearWatch();
      this.map.remove();
    }
    this.map = null;
  }

  /**
   * Given a Location, place it on the map.
   * @param location
   */
  public addLocation(location: clueRide.Location) {
    this.locationMap[location.id] = location;
    let locationMarker = this.markers.getLocationMarker(location)
      .on('click', (mouseEvent) => {
        console.log(mouseEvent);
        let crMarker: CRMarker = <any> mouseEvent.target;
        let locId = crMarker.locationId;
        let loc = this.locationMap[locId];
        let tabId = MapComponent.getTabIdForLocation(loc);

        this.appCtrl.getRootNav().push(LocEditPage, {
          location: loc,
          tabId: tabId
        });
        return null;
      });
    locationMarker.addTo(this.map);
  }

  /**
   * Reads the Location's readiness level to determine which tab to show.
   * @param {clueRide.Location} loc instance carrying a readinessLevel.
   * @returns {number} representing an offset from Draft.
   */
  private static getTabIdForLocation(loc: clueRide.Location) {
    switch(loc.readinessLevel) {
      case 'FEATURED':
        return 2;
      case 'ATTRACTION':
        return 1;
      default:
        return 0;
    }
  }

}
