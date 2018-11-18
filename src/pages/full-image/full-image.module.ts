import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { FullImagePage } from './full-image';

@NgModule({
  declarations: [
    FullImagePage,
  ],
  imports: [
    IonicPageModule.forChild(FullImagePage),
  ],
})
export class FullImagePageModule {}
