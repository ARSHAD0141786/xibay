import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { SecondaryMainPage } from './secondary-main';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    SecondaryMainPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryMainPage),
    IonicImageViewerModule
  ],
})
export class SecondaryMainPageModule {}
