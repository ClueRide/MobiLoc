import {BrowserModule} from "@angular/platform-browser";
import {CloudModule, CloudSettings} from "@ionic/cloud-angular";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";

import {RestangularConfigFactory} from "../providers/resources/resource.config";
import {RestangularModule} from "ngx-restangular/dist/esm/src";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {GeoLocComponent} from "../components/geo-loc/geo-loc";
import {LoginPage} from "../pages/login/login";
import {MapComponent} from "../components/map/map";
import {MarkersComponent} from "../components/markers/markers";
import {Creds} from "../providers/creds/creds.service";

/* TODO: place this inside the Google-specific OAuth module. */
export const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'd7271bbc'
  },
  'auth': {
    'google': {
      'webClientId': '989278627857-1bei5m1ek171qcb0ork8s1brnuacm84p.apps.googleusercontent.com',
      // 'offline': true,
      // 'scope': "email profile"
    }
  }
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    GeoLocComponent,
    MapComponent,
    MarkersComponent,
  ],
  imports: [
    BrowserModule,
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(MyApp),
    RestangularModule.forRoot(RestangularConfigFactory),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
  ],
  providers: [
    Creds,
    GeoLocComponent,
    MapComponent,
    MarkersComponent,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
