import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { RequestsPage } from './requests';

@NgModule({
  declarations: [
    RequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsPage),
  ],
})
export class RequestsPageModule {}
