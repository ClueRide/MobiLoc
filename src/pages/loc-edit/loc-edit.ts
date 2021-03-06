import {Component} from "@angular/core";
import {Location, LocationService, LocTypeService} from "front-end-common";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {ImageService} from "../../providers/image/image.service";
import {MapDataService} from "../../providers/map-data/map-data";
import {ImageCapturePage} from "../image-capture/image-capture";
import {ImagesPage} from "../images/images";

// tslint:disable-next-line

/**
 * Generated class for the LocEditPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-loc-edit',
  templateUrl: 'loc-edit.html',
  providers: [
    LocTypeService,
  ]
})
@IonicPage()
export class LocEditPage {

  editSegment: string;
  location: Location;
  hasMultipleImages: boolean = false;
  private editSegments = [
    'draft',
    'attraction',
    'featured'
  ];

  locTypes = [];

  constructor(
    private alertCtrl: AlertController,
    private imageService: ImageService,
    private locationService: LocationService,
    private locationTypeService: LocTypeService,
    private navParams: NavParams,
    private navCtrl: NavController,
    private mapDataService: MapDataService,
  ) {
    this.editSegment = this.editSegments[this.navParams.get("tabId")];
    this.location = this.navParams.get("location");
    if (!this.location.mainLink) {
      this.location.mainLink = {link: '', id: null};
    }
  }

  ionViewWillEnter() {
    this.reloadLocTypes();
    this.imageService.hasMultipleImages(this.location.id)
      .subscribe(
        (hasMultipleImages) => {this.hasMultipleImages = hasMultipleImages;}
      );
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Invoked when the user is ready to persist changes.
   */
  save() {
    console.log("Saving");
    this.locationService.update(this.location).subscribe(
      (updatedLocation: Location) => {
        this.mapDataService.updateLocation(updatedLocation);
      }
    );
    this.navCtrl.pop();
  }

  /** Opens the Page that performs Camera operations passing the the location and the "Camera" flag. */
  captureImage() {
    console.log("Opening Camera");
    this.navCtrl.push(ImageCapturePage, {
      location: this.location,
      mode: 'camera'
    });
  }

  /** Opens the Page that performs Camera operations passing the the location and the "Camera" flag. */
  imageFromGallery() {
    console.log("Opening Gallery");
    this.navCtrl.push(ImageCapturePage, {
      location: this.location,
      mode: 'gallery'
    });
  }

  showImageActions() {
    console.log("Show Image Actions");
    let alert = this.alertCtrl.create({
      title: 'Unlink this Image?',
      message: 'Do you want to unset the Featured Image? (Image can be re-featured later)',
      buttons: [
        {
          text: 'Keep Featured Image',
          handler: () => {
            console.log('Keep');
          }
        },
        {
          text: 'Unset Featured Image',
          handler: () => {
            console.log('Removing Featured Image');
            this.locationService.removeFeaturedImage(this.location.id).subscribe(
              (location) => {
                // TODO: Just noticed that this will overwrite any other changes
                this.location = location;
              }
            );
          }
        }
      ]
    });

    alert.present();
  }

  showOtherImages() {
    this.navCtrl.push(
      ImagesPage,
      {location: this.location}
    );
  }

  /** Make sure we've got a currently ordered list of Loc Types. */
  reloadLocTypes() {
    this.locTypes = [];
    this.locationTypeService.allLocationTypes().forEach(
      (locationType) => {
        this.locTypes.push(
          {
            value: locationType.id,
            text: locationType.name
          }
        );
      }
    );
  }

}
