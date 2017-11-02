import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";

import {SessionTokenService} from "../providers/session-token/session-token.service";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {LoginPage} from "../pages/login/login";
import {LocEditPage} from "../pages/loc-edit/loc-edit";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public sessionTokenService: SessionTokenService,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Map', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Edit', component: LocEditPage },
      { title: 'Login', component: LoginPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  ngOnInit() {
    console.log("App is initialized");
    /* This is dependent on the loadToken having been run (promise resolved) as the initialization of the app. */
    if (this.sessionTokenService.isGuest()) {
      console.log("1. Running as Guest");
      this.nav.setRoot(LoginPage);
    } else {
      console.log("1. Running as " + this.sessionTokenService.getPrincipalName());
      this.nav.setRoot(HomePage);
    }
  }
}
