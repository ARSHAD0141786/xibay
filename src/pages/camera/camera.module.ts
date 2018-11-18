import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { CameraPage } from './camera';

@NgModule({
  declarations: [
    CameraPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraPage),
  ],
})
export class CameraPageModule {}
