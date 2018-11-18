import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { DescriptionPage } from './description';

@NgModule({
  declarations: [
    DescriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(DescriptionPage),
  ],
})
export class DescriptionPageModule {}
