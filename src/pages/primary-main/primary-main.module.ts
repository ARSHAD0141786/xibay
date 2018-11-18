import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { PrimaryMainPage } from './primary-main';

@NgModule({
  declarations: [
    PrimaryMainPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryMainPage),
  ],
})
export class PrimaryMainPageModule {}
