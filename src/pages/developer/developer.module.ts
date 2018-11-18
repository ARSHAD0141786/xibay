import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { DeveloperPage } from './developer';

@NgModule({
  declarations: [
    DeveloperPage,
  ],
  imports: [
    IonicPageModule.forChild(DeveloperPage),
  ],
})
export class DeveloperPageModule {}
