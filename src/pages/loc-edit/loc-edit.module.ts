import {ConnectionStateComponentModule, LocTypeChipModule} from "front-end-common";
import {ImageCapturePageModule} from "../image-capture/image-capture.module";
import {IonicPageModule} from "ionic-angular";
import {LocEditPage} from "./loc-edit";
import {NgModule} from "@angular/core";
import {PuzzleListComponentModule} from "../../components/puzzle-list/puzzle-list.module";

@NgModule({
  declarations: [
    LocEditPage,
  ],
  imports: [
    ConnectionStateComponentModule,
    ImageCapturePageModule,
    IonicPageModule.forChild(LocEditPage),
    LocTypeChipModule,
    PuzzleListComponentModule,
  ],
})
export class LocEditPageModule {}
