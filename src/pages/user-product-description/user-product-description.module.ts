import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProductDescriptionPage } from './user-product-description';

@NgModule({
  declarations: [
    UserProductDescriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProductDescriptionPage),
  ],
})
export class UserProductDescriptionPageModule {}
